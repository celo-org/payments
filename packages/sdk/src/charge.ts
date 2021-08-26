import { Err, ErrorResult, Ok } from '@celo/base';
import {
  AbortCode,
  GetInfoResponse,
  JsonRpcMethods,
  KYC,
  PaymentMessageRequest,
} from '@celo/payments-types';
import { ChainHandler } from './handlers/interface';
import { fetchWithRetries, parseUri } from './helpers';
import { buildTypedPaymentRequest } from './signing';

/**
 * Charge object for use in the Celo Payments Protocol
 */
export class Charge {
  private paymentInfo?: GetInfoResponse;

  /**
   * Instantiates a new charge object for use in the Celo Payments Protocol
   *
   * @param baseUrl url of the payment service provider implementing the protocol
   * @param referenceId reference ID of the charge
   * @param chainHandler handler to abstract away chain interaction semantics
   */
  constructor(
    private baseUrl: string,
    private referenceId: string,
    private chainHandler: ChainHandler
  ) {}

  /**
   * Instantiates a new charge object for use in the Celo Payments Protocol
   * from a URI, often encoded as part of a QR code.
   *
   * @param uri encoded URI with `baseUrl` and `referenceId`
   * @param chainHandler handler to abstract away chain interaction semantics
   * @returns an instance of the Payments class
   */
  static fromUri(uri: string, chainHandler: ChainHandler) {
    const { baseUrl, referenceId } = parseUri(uri);
    return new Charge(baseUrl, referenceId, chainHandler);
  }

  /**
   * Creates authenticated requests to the `baseUrl`
   *
   * @param route the endpoint to hit
   * @param method the HTTP method to use for the request
   * @param body optional body of the HTTP request
   */
  private async request(message: PaymentMessageRequest) {
    const response = await fetchWithRetries(`${this.baseUrl}/rpc`, {
      method: 'POST',
      body: JSON.stringify({
        id: 0,
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
    });

    if (response.status >= 400) {
      return Err(new Error(await response.text()));
    }

    if (response.status === 204) {
      return Ok(null);
    }

    try {
      return Ok(await response.json());
    } catch (e) {
      return Err(e);
    }
  }

  /**
   * Performs the GetInfo request of the Celo Payments Protocol.
   *
   * @returns
   */
  async getInfo() {
    const response = await this.request({
      method: JsonRpcMethods.GetInfo,
      params: {
        referenceId: this.referenceId,
      },
    });
    if (!response.ok) {
      throw new Error((response as ErrorResult<any>).error);
    }

    // TODO: schema validation
    this.paymentInfo = response.result as GetInfoResponse;
    return this.paymentInfo;
  }

  /**
   * Performs the InitCharge and ReadyForSettlement requests of the Celo Payments Protocol.
   *
   * @param payerData
   * @returns
   */
  async submit(payerData: KYC) {
    const transactionHash = await this.chainHandler.computeTransactionHash(
      this.paymentInfo!
    );

    const response = await this.request({
      method: JsonRpcMethods.Init,
      params: {
        transactionHash,
        referenceId: this.referenceId,
        sender: {
          accountAddress: await this.chainHandler.getSendingAddress(),
          payerData,
        },
      },
    });
    // TODO: schema validation
    if (!response.ok) {
      throw new Error('Invalid init charge response');
    }

    try {
      await this.chainHandler.submitTransaction(this.paymentInfo!);
    } catch (e) {
      // TODO: retries?
      await this.abort(AbortCode.unable_to_submit_transaction);
      throw new Error(AbortCode.unable_to_submit_transaction);
    }

    await this.request({
      method: JsonRpcMethods.Confirm,
      params: {
        referenceId: this.referenceId,
      },
    });
    return response;
  }

  /**
   * Aborts a request
   */
  async abort(code: AbortCode, message?: string) {
    await this.request({
      method: JsonRpcMethods.Abort,
      params: {
        referenceId: this.referenceId,
        abort_code: code,
        abort_message: message,
      },
    });
  }
}
