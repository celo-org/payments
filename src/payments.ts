import { Err, Ok } from '@celo/base';

import { GetInfo } from './schemas';
import { fetchWithRetries, parseUri } from './helpers';

type ComputeTransactionHash = (request: GetInfo) => Promise<string>;
type SubmitTransaction = (request: GetInfo) => Promise<string>;

enum AbortCode {
  reference_id_not_found = 'reference_id_not_found',
  risk_checks_failed = 'risk_checks_failed',
  missing_information = 'missing_information',
  payment_type_mismatch = 'payment_type_mismatch',
  invalid_command_type = 'invalid_command_type',
  unspecified_error = 'unspecified_error',
  unable_to_submit_transaction = 'unable_to_submit_transaction',
}

/**
 * Implementation of the Celo Payments Protocol
 */
export class Payments {
  private paymentInfo?: GetInfo;

  constructor(
    private baseUrl: string,
    private referenceId: string,
    private computeTransactionHash: ComputeTransactionHash,
    private submitTransaction: SubmitTransaction
  ) {}

  static fromUri(
    uri: string,
    computeTransactionHash: ComputeTransactionHash,
    submitTransaction: SubmitTransaction
  ) {
    // TODO: handle QR URI's
    const { baseUrl, referenceId } = parseUri(uri);
    return new Payments(
      baseUrl,
      referenceId,
      computeTransactionHash,
      submitTransaction
    );
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
      headers: {},
    });
    if (response.status >= 400) {
      // TODO: handle errors
      return Err(new Error(''));
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

  async getInfo() {
    const response = await this.request(
      `/purchases/${this.referenceId}`,
      'GET'
    );
    if (!response.ok) {
      throw new Error('');
    }

    // TODO: schema validation
    this.paymentInfo = response.result as GetInfo;
    return this.paymentInfo;
  }

  async submit(kyc: { [x: string]: any }) {
    const transactionHash = await this.computeTransactionHash(
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
      await this.submitTransaction(this.paymentInfo!);
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
  abort(code: AbortCode) {}
}
