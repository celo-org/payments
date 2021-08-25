import { ErrorResult } from '@celo/base';
import { Err, Ok } from '@celo/base';
import { AbortCode } from '@celo/payments-types';
import { BlockChainHandler } from './handlers/interface';
import { fetchWithRetries, parseUri } from './helpers';
import { GetInfo } from './schemas';

enum Methods {
  GetInfo = 'getPaymentInfo',
  Init = 'initCharge',
  Confirm = 'readyForSettlement',
  Abort = 'abort',
}

/**
 * Charge object for use in the Celo Payments Protocol
 */
export class Charge {
  private paymentInfo?: GetInfo;

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
    private chainHandler: BlockChainHandler
  ) {}

  /**
   * Instantiates a new charge object for use in the Celo Payments Protocol
   * from a URI, often encoded as part of a QR code.
   *
   * @param uri encoded URI with `baseUrl` and `referenceId`
   * @param chainHandler handler to abstract away chain interaction semantics
   * @returns an instance of the Payments class
   */
  static fromUri(uri: string, chainHandler: BlockChainHandler) {
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
  private async request(method: Methods, params: { [x: string]: any }) {
    const response = await fetchWithRetries(`${this.baseUrl}`, {
      method: 'POST',
      body: JSON.stringify({
        id: 0,
        jsonrpc: '2.0',
        method,
        params,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // TODO: Authentication
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
    const response = await this.request(Methods.GetInfo, {
      referenceId: this.referenceId,
    });
    if (!response.ok) {
      throw new Error((response as ErrorResult<any>).error);
    }

    // TODO: schema validation
    this.paymentInfo = response.result as GetInfo;
    return this.paymentInfo;
  }

  /**
   * Performs the InitCharge and ReadyForSettlement requests of the Celo Payments Protocol.
   *
   * @param payerData
   * @returns
   */
  async submit(payerData: { [x: string]: any }) {
    const transactionHash = await this.chainHandler.computeTransactionHash(
      this.paymentInfo!
    );

    const response = await this.request(Methods.Init, {
      referenceId: this.referenceId,
      transactionHash,
      sender: {
        accountAddress: await this.chainHandler.getSendingAddress(),
        payerData,
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

    await this.request(Methods.Confirm, { referenceId: this.referenceId });
    return response;
  }

  /**
   * Aborts a request
   */
  async abort(code: AbortCode, message?: string) {
    await this.request(Methods.Abort, {
      referenceId: this.referenceId,
      abort_code: code,
      abort_message: message,
    });
  }
}
