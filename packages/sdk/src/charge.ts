import { Err, Ok } from '@celo/base';
import { AbortCode } from '@celo/payments-types';
import { TransactionHandler } from './handlers/interface';
import { fetchWithRetries, parseUri } from './helpers';
import { GetInfo } from './schemas';

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
   * @param transactionHandler handler to abstract away chain interaction semantics
   */
  constructor(
    private baseUrl: string,
    private referenceId: string,
    private transactionHandler: TransactionHandler
  ) {}

  /**
   * Instantiates a new charge object for use in the Celo Payments Protocol
   * from a URI, often encoded as part of a QR code.
   *
   * @param uri encoded URI with `baseUrl` and `referenceId`
   * @param transactionHandler handler to abstract away chain interaction semantics
   * @returns an instance of the Payments class
   */
  static fromUri(uri: string, transactionHandler: TransactionHandler) {
    const { baseUrl, referenceId } = parseUri(uri);
    return new Charge(baseUrl, referenceId, transactionHandler);
  }

  /**
   * Creates authenticated requests to the `baseUrl`
   *
   * @param route the endpoint to hit
   * @param method the HTTP method to use for the request
   * @param body optional body of the HTTP request
   */
  private async request(
    route: string,
    method: string,
    body?: { [x: string]: any }
  ) {
    const response = await fetchWithRetries(`${this.baseUrl}${route}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
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
    const response = await this.request(
      `/purchases/${this.referenceId}`,
      'GET'
    );
    console.log(response);
    if (!response.ok) {
      throw new Error('');
    }

    // TODO: schema validation
    this.paymentInfo = response.result as GetInfo;
    return this.paymentInfo;
  }

  /**
   * Performs the InitCharge and ReadyForSettlement requests of the Celo Payments Protocol.
   *
   * @param kyc
   * @returns
   */
  async submit(kyc: { [x: string]: any }) {
    const transactionHash = await this.transactionHandler.computeHash(
      this.paymentInfo!
    );

    const result = await this.request(
      `/purchases/${this.referenceId}`,
      'POST',
      { kyc, transactionHash }
    );
    // TODO: schema validation
    if (!result.ok) {
      throw new Error('');
    }

    try {
      await this.transactionHandler.submit(this.paymentInfo!);
    } catch (e) {
      // TODO: retries?
      await this.abort(AbortCode.unable_to_submit_transaction);
      throw new Error(AbortCode.unable_to_submit_transaction);
    }

    await this.request(`/purchases/${this.referenceId}/confirmation`, 'GET');
    return result;
  }

  /**
   * Aborts a request
   */
  abort(code: AbortCode) {
    console.log(code);
  }
}
