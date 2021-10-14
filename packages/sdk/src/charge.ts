import { Err, ErrorResult, Ok } from '@celo/base';
import {
  AbortCodes,
  AbortRequest,
  EIP712Parameter,
  EIP712Schemas,
  GetPaymentInfoRequest,
  InitChargeRequest,
  JsonRpcErrorResponse,
  JsonRpcInvalidParameterError,
  JsonRpcMethodNotFoundError,
  JsonRpcReferenceIdNotFoundError,
  JsonRpcRiskChecksFailedError,
  OffchainHeaders,
  PayerData,
  PaymentInfo,
  PaymentMessageRequest,
  ReadyForSettlementRequest,
} from '@celo/payments-types';
import { randomInt } from 'crypto';
import { OnchainFailureError } from './errors/onchain-failure';
import { ChainHandler } from './handlers';
import { fetchWithRetries, parseDeepLink, verifySignature } from './helpers';
import { buildTypedPaymentRequest } from '@celo/payments-utils';

interface JsonRpcErrorResult extends Error {
  name: string;
  message: string;
}

/**
 * Charge object for use in the Celo Payments Protocol
 */
export class Charge {
  private paymentInfo?: PaymentInfo;

  /**
   * Instantiates a new charge object for use in the Celo Payments Protocol
   *
   * @param apiBase url of the payment service provider implementing the protocol
   * @param referenceId reference ID of the charge
   * @param chainHandler handler to abstract away chain interaction semantics
   */
  constructor(
    public apiBase: string,
    public referenceId: string,
    private chainHandler: ChainHandler
  ) {}

  /**
   * Instantiates a new charge object for use in the Celo Payments Protocol
   * from a URI, often encoded as part of a QR code.
   *
   * @param deepLink encoded URI with `apiBase` and `referenceId`
   * @param chainHandler handler to abstract away chain interaction semantics
   * @returns an instance of the Payments class
   */
  static fromDeepLink(deepLink: string, chainHandler: ChainHandler) {
    const { apiBase, referenceId } = parseDeepLink(deepLink);
    return new Charge(apiBase, referenceId, chainHandler);
  }

  /**
   * Creates authenticated requests to the `apiBase`
   *
   * @param message the HTTP body with the JSON-RPC params of the request
   * @param requestSchema
   * @param responseSchema
   * @param responseSchemaName
   */
  private async request(
    message: PaymentMessageRequest,
    requestSchema: EIP712Parameter[],
    responseSchema: EIP712Parameter[],
    responseSchemaName: string
  ) {
    const requestId = randomInt(281474976710655);
    Object.assign(message, {
      id: requestId,
      jsonrpc: '2.0',
    });
    const typedData = buildTypedPaymentRequest(
      message,
      requestSchema,
      await this.chainHandler.getChainId()
    );

    const signature = await this.chainHandler.signTypedPaymentRequest(
      typedData
    );
    const request = {
      method: 'POST',
      body: JSON.stringify(message),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        [OffchainHeaders.SIGNATURE]: signature,
        [OffchainHeaders.ADDRESS]: this.chainHandler.getSendingAddress(),
      },
    };
    const response = await fetchWithRetries(`${this.apiBase}/rpc`, request);

    const jsonResponse = await response.json();

    const responseSignature = response.headers.get(OffchainHeaders.SIGNATURE);
    const responseAddress = response.headers.get(OffchainHeaders.ADDRESS);
    if (Object.keys(jsonResponse).includes('error')) {
      responseSchema = EIP712Schemas.JsonRpcErrorResponse;
      responseSchemaName = 'JsonRpcErrorResponse';
    }
    const signatureVerified = await verifySignature(
      this.chainHandler,
      responseSignature,
      responseAddress,
      jsonResponse,
      responseSchema,
      responseSchemaName
    );
    if (!signatureVerified) {
      return Err(
        new Error(
          `Response signature cant be verified (signature: ${responseSignature}, address: ${responseAddress})`
        )
      );
    }

    if (jsonResponse.id !== requestId) {
      return Err(
        new Error(
          `JsonRpc response id (${jsonResponse.id}) different from request (${requestId})`
        )
      );
    }

    if (response.status >= 400) {
      const jsonError = jsonResponse as JsonRpcErrorResponse;
      let name = 'JsonRpcError';
      switch (jsonError.error.code) {
        case JsonRpcReferenceIdNotFoundError.code.value:
          name = 'ReferenceIdNotFoundError';
          break;
        case JsonRpcInvalidParameterError.code.value:
          name = 'InvalidParameterError';
          break;
        case JsonRpcRiskChecksFailedError.code.value:
          name = 'RiskChecksFailedError';
          break;
        case JsonRpcMethodNotFoundError.code.value:
          name = 'MethodNotFoundError';
          break;
      }
      return Err<JsonRpcErrorResult>({
        name,
        message: jsonError.error.message,
        ...jsonError.error,
      });
    }

    if (response.status === 204) {
      return Ok(null);
    }

    try {
      return Ok(jsonResponse.result);
    } catch (e) {
      return Err(e);
    }
  }

  private async requestWithErrorHandling(
    params: PaymentMessageRequest,
    schema: EIP712Parameter[],
    responseSchema: EIP712Parameter[],
    responseSchemaName: string
  ) {
    const response = await this.request(
      params,
      schema,
      responseSchema,
      responseSchemaName
    );
    if (!response.ok) {
      const error = (response as ErrorResult<JsonRpcErrorResult>).error;
      throw new Error(error.message);
    }
    return response;
  }

  /**
   * Performs the GetInfo request of the Celo Payments Protocol.
   *
   * @returns
   */
  async getInfo(): Promise<PaymentInfo> {
    const getPaymentInfoRequest: GetPaymentInfoRequest = {
      method: GetPaymentInfoRequest.method.value,
      params: {
        referenceId: this.referenceId,
      },
    };

    const response = await this.requestWithErrorHandling(
      getPaymentInfoRequest,
      EIP712Schemas.GetPaymentInfo,
      EIP712Schemas.GetPaymentInfoResponse,
      'GetPaymentInfoResponse'
    );

    // TODO: schema validation
    this.paymentInfo = response.result as PaymentInfo;
    return this.paymentInfo;
  }

  /**
   * Performs the InitCharge and ReadyForSettlement requests of the Celo Payments Protocol.
   *
   * @param payerData
   * @returns
   */
  async submit(payerData: PayerData) {
    if (!this.paymentInfo) {
      return Err(new Error('getInfo() has not been called'));
    }

    // TODO: validate payerData contains all required fields by this.paymentInfo.requiredPayerData
    const transactionHash = await this.chainHandler.computeTransactionHash(
      this.paymentInfo
    );

    const response = await this.sendInitChargeRequest(
      payerData,
      transactionHash
    );

    await this.sendReadyForSettlementRequest();

    await this.submitTransactionOnChain();

    return response;
  }

  private async sendInitChargeRequest(
    payerData: PayerData,
    transactionHash: string
  ) {
    const initChargeRequest: InitChargeRequest = {
      method: InitChargeRequest.method.value,
      params: {
        sender: {
          accountAddress: await this.chainHandler.getSendingAddress(),
          payerData,
        },
        referenceId: this.referenceId,
        transactionHash,
      },
    };

    return await this.requestWithErrorHandling(
      initChargeRequest,
      EIP712Schemas.InitCharge,
      EIP712Schemas.InitChargeResponse,
      'InitChargeResponse'
    );
  }

  private async sendReadyForSettlementRequest() {
    const readyForSettlementRequest: ReadyForSettlementRequest = {
      method: ReadyForSettlementRequest.method.value,
      params: {
        referenceId: this.referenceId,
      },
    };

    return await this.requestWithErrorHandling(
      readyForSettlementRequest,
      EIP712Schemas.ReadyForSettlement,
      EIP712Schemas.ReadyForSettlementResponse,
      'ReadyForSettlementResponse'
    );
  }

  private async submitTransactionOnChain() {
    if (!this.paymentInfo) {
      throw new Error('getInfo() has not been called');
    }

    try {
      await this.chainHandler.submitTransaction(this.paymentInfo);
    } catch (e) {
      // TODO: retries?
      throw new OnchainFailureError(AbortCodes.COULD_NOT_PUT_TRANSACTION);
    }
  }

  /**
   * Aborts a request
   */
  async abort(code: AbortCodes, message?: string) {
    const abortRequest: AbortRequest = {
      method: AbortRequest.method.value,
      params: {
        referenceId: this.referenceId,
        abortCode: code,
        abortMessage: message,
      },
    };

    return await this.requestWithErrorHandling(
      abortRequest,
      EIP712Schemas.Abort,
      EIP712Schemas.AbortResponse,
      'AbortResponse'
    );
  }
}
