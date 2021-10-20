import { Err, ErrorResult, Ok } from '@celo/base';
import {
  AbortCodes,
  AbortRequest,
  EIP712Schemas,
  EIP712TypeDefinition,
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
import BigNumber from 'bignumber.js';

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
   * @param useAuthentication
   */
  constructor(
    public apiBase: string,
    public referenceId: string,
    private chainHandler: ChainHandler,
    private useAuthentication: boolean
  ) {}

  /**
   * Instantiates a new charge object for use in the Celo Payments Protocol
   * from a URI, often encoded as part of a QR code.
   *
   * @param deepLink encoded URI with `apiBase` and `referenceId`
   * @param chainHandler handler to abstract away chain interaction semantics
   * @param useAuthentication should all off-chain commands be signed and verified
   * @returns an instance of the Payments class
   */
  static fromDeepLink(
    deepLink: string,
    chainHandler: ChainHandler,
    useAuthentication: boolean = true
  ) {
    const { apiBase, referenceId } = parseDeepLink(deepLink);
    return new Charge(apiBase, referenceId, chainHandler, useAuthentication);
  }

  /**
   * Creates authenticated requests to the `apiBase`
   *
   * @param message the HTTP body with the JSON-RPC params of the request
   * @param requestTypeDefinition
   * @param responseTypeDefinition
   */
  private async request(
    message: PaymentMessageRequest,
    requestTypeDefinition: EIP712TypeDefinition,
    responseTypeDefinition: EIP712TypeDefinition
  ) {
    const requestId = randomInt(281474976710655);
    Object.assign(message, {
      id: requestId,
      jsonrpc: '2.0',
    });
    const typedData = buildTypedPaymentRequest(
      message,
      requestTypeDefinition.schema,
      await this.chainHandler.getChainId()
    );

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      [OffchainHeaders.ADDRESS]: this.chainHandler.getSendingAddress(),
    };

    if (this.useAuthentication) {
      const signature = await this.chainHandler.signTypedPaymentRequest(
        typedData
      );
      Object.assign(headers, {
        [OffchainHeaders.SIGNATURE]: signature,
      });
    }

    const request = {
      method: 'POST',
      body: JSON.stringify(message),
      headers,
    };
    const response = await fetchWithRetries(`${this.apiBase}/rpc`, request);

    const jsonResponse = await response.json();

    if (this.useAuthentication) {
      const responseSignature = response.headers.get(OffchainHeaders.SIGNATURE);
      const responseAddress = response.headers.get(OffchainHeaders.ADDRESS);
      if (Object.keys(jsonResponse).includes('error')) {
        responseTypeDefinition = EIP712Schemas.JsonRpcErrorResponse;
      }
      const signatureVerified = await verifySignature(
        this.chainHandler,
        responseSignature,
        responseAddress,
        jsonResponse,
        responseTypeDefinition
      );
      if (!signatureVerified) {
        return Err(
          new Error(
            `Response signature cant be verified (signature: ${responseSignature}, address: ${responseAddress})`
          )
        );
      }
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
      let result = jsonResponse.result;
      const resultParamater = responseTypeDefinition.schema.find(
        (p) => p.name === 'result'
      );
      if (resultParamater && resultParamater.type) {
        const baseType = resultParamater.type;
        this.parseWithBigNumbers(result, baseType);
      }
      return Ok(result);
    } catch (e) {
      return Err(e);
    }
  }

  private parseWithBigNumbers(result: any, type: string) {
    let child = EIP712Schemas[type];
    for (let field of child.schema) {
      if (child.bigNumbers.includes(field.name)) {
        result[field.name] = new BigNumber(result[field.name]);
      }
      if (Object.keys(EIP712Schemas).includes(field.type)) {
        this.parseWithBigNumbers(result[field.name], field.type);
      }
    }
  }

  private async requestWithErrorHandling(
    params: PaymentMessageRequest,
    requestTypeDefinition: EIP712TypeDefinition,
    responseTypeDefinition: EIP712TypeDefinition
  ) {
    const response = await this.request(
      params,
      requestTypeDefinition,
      responseTypeDefinition
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
      EIP712Schemas.GetPaymentInfoResponse
    );

    // TODO: schema validation
    this.paymentInfo = response.result as PaymentInfo;
    return this.paymentInfo;
  }

  /**
   * Performs the InitCharge request of the Celo Payments Protocol to initiate the payment flow
   * If you want a complete sequence - use `submit` function of this class
   *
   * @param payerData
   * @returns
   */
  async initCharge(payerData: PayerData): Promise<void> {
    // TODO: validate payerData contains all required fields by this.paymentInfo.requiredPayerData
    const transactionHash = await this.chainHandler.computeTransactionHash(
      this.paymentInfo
    );

    const initChargeRequest: InitChargeRequest = {
      method: InitChargeRequest.method.value,
      params: {
        sender: {
          accountAddress: this.chainHandler.getSendingAddress(),
          payerData,
        },
        referenceId: this.referenceId,
        transactionHash,
      },
    };

    await this.requestWithErrorHandling(
      initChargeRequest,
      EIP712Schemas.InitCharge,
      EIP712Schemas.InitChargeResponse
    );
  }

  /**
   * Performs the ReadyForSettlement request of the Celo Payments Protocol
   * If you want a complete sequence - use `submit` function of this class
   *
   * @returns
   */

  async readyForSettlement() {
    const readyForSettlementRequest: ReadyForSettlementRequest = {
      method: ReadyForSettlementRequest.method.value,
      params: {
        referenceId: this.referenceId,
      },
    };

    return await this.requestWithErrorHandling(
      readyForSettlementRequest,
      EIP712Schemas.ReadyForSettlement,
      EIP712Schemas.ReadyForSettlementResponse
    );
  }

  /**
   * Submit the on-chain transaction
   * If you want a complete sequence - use `submit` function of this class
   *
   * @returns
   */
  async submitTransactionOnChain() {
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
   * Performs the InitCharge and ReadyForSettlement requests of the Celo Payments Protocol.
   *
   * @param payerData
   * @returns
   */
  async submit(payerData: PayerData): Promise<void> {
    if (!this.paymentInfo) {
      throw new Error('getInfo() has not been called');
    }

    await this.initCharge(payerData);

    await this.readyForSettlement();

    await this.submitTransactionOnChain();
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
      EIP712Schemas.AbortResponse
    );
  }
}
