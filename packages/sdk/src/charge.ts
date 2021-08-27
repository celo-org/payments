import { Err, ErrorResult, Ok } from '@celo/base';
import { fetchWithRetries, parseDeepLink } from './helpers';
import {
  AbortCode,
  GetPaymentInfoRequest,
  InitChargeRequest,
  JsonRpcErrorResponse,
  PayerData,
  PaymentInfo,
  PaymentMessageRequest,
  ReadyForSettlementRequest,
} from '@celo/payments-types';
import { randomInt } from 'crypto';
import { ChainHandler } from './handlers/interface';
import { buildTypedPaymentRequest } from './signing';

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
   */
  private async request(message: PaymentMessageRequest) {
    const requestId = randomInt(281474976710655);
    const request = {
      method: 'POST',
      body: JSON.stringify({
        id: requestId,
        jsonrpc: '2.0',
        ...message,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: await this.chainHandler.signTypedPaymentRequest(
          buildTypedPaymentRequest(
            message,
            await this.chainHandler.getChainId()
          )
        ),
      },
    };
    const response = await fetchWithRetries(`${this.apiBase}/rpc`, request);

    const jsonResponse = await response.json();
    if (jsonResponse.id !== requestId) {
      return Err(
        new Error(
          `JsonRpc response id (${jsonResponse.id}) different from request (${requestId})`
        )
      );
    }

    if (response.status >= 400) {
      const jsonError = jsonResponse as JsonRpcErrorResponse;
      return Err<JsonRpcErrorResult>({
        name: 'JsonRpcError',
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

  private async requestWithErrorHandling(params: PaymentMessageRequest) {
    const response = await this.request(params);
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
      method: GetPaymentInfoRequest.method.GET_PAYMENT_INFO,
      params: {
        referenceId: this.referenceId,
      },
    };

    const response = await this.requestWithErrorHandling(getPaymentInfoRequest);

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
    // TODO: validate payerData contains all required fields by this.paymentInfo.requiredPayerData
    const transactionHash = await this.chainHandler.computeTransactionHash(
      this.paymentInfo!
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
      method: InitChargeRequest.method.INIT_CHARGE,
      params: {
        sender: {
          accountAddress: await this.chainHandler.getSendingAddress(),
          payerData,
        },
        referenceId: this.referenceId,
        transactionHash,
      },
    };

    return await this.requestWithErrorHandling(initChargeRequest);
  }

  private async sendReadyForSettlementRequest() {
    const readyForSettlementRequest: ReadyForSettlementRequest = {
      method: ReadyForSettlementRequest.method.READY_FOR_SETTLEMENT,
      params: {
        referenceId: this.referenceId,
      },
    };

    return await this.requestWithErrorHandling(readyForSettlementRequest);
  }

  private async submitTransactionOnChain() {
    try {
      await this.chainHandler.submitTransaction(this.paymentInfo!);
    } catch (e) {
      // TODO: retries?
      // await this.abort(AbortCode.unable_to_submit_transaction);
      throw new Error(AbortCode.unable_to_submit_transaction);
    }
  }

  /**
   * Aborts a request
   */
  async abort(/*code: AbortCode, message?: string*/) {
    // await this.request({
    //   method: JsonRpcMethods.Abort,
    //   params: {
    //     referenceId: this.referenceId,
    //     abort_code: code,
    //     abort_message: message,
    //   },
    // });
  }
}
