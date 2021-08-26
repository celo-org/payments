import { Err, ErrorResult, Ok } from '@celo/base';
import { BlockChainHandler } from './handlers/interface';
import { fetchWithRetries, parseDeepLink } from './helpers';
import {
  AbortCode,
  GetPaymentInfoParams,
  GetPaymentInfoResponseData as PaymentInfo,
  InitChargeParams,
  PayerData,
  ReadyForSettlementParams,
} from '@celo/payments-types';

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
    private chainHandler: BlockChainHandler
  ) {}

  /**
   * Instantiates a new charge object for use in the Celo Payments Protocol
   * from a URI, often encoded as part of a QR code.
   *
   * @param deepLink encoded URI with `apiBase` and `referenceId`
   * @param chainHandler handler to abstract away chain interaction semantics
   * @returns an instance of the Payments class
   */
  static fromDeepLink(deepLink: string, transactionHandler: BlockChainHandler) {
    const { apiBase, referenceId } = parseDeepLink(deepLink);
    return new Charge(apiBase, referenceId, transactionHandler);
  }

  /**
   * Creates authenticated requests to the `apiBase`
   *
   * @param route the endpoint to hit
   * @param params the HTTP body with the JSON-RPC params of the request
   */
  private async request<T>(params: T) {
    const response = await fetchWithRetries(`${this.apiBase}/rpc`, {
      method: 'POST',
      body: JSON.stringify({
        id: 0,
        jsonrpc: '2.0',
        ...params,
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
  async getInfo(): Promise<PaymentInfo> {
    const getPaymentInfoParams: GetPaymentInfoParams = {
      method: GetPaymentInfoParams.method.GET_PAYMENT_INFO,
      params: {
        referenceId: this.referenceId,
      },
    };

    const response = await this.request(getPaymentInfoParams);
    if (!response.ok) {
      throw new Error((response as ErrorResult<any>).error);
    }

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

    const initChargeParams: InitChargeParams = {
      method: InitChargeParams.method.INIT_CHARGE,
      params: {
        sender: {
          accountAddress: await this.chainHandler.getSendingAddress(),
          payerData,
        },
        referenceId: this.referenceId,
        /**
         * Transaction hash (pre-calculated), in Hex format
         */
        transactionHash,
      },
    };

    const response = await this.request(initChargeParams);
    if (!response.ok) {
      throw new Error('Invalid init charge response');
    }

    try {
      await this.chainHandler.submitTransaction(this.paymentInfo!);
    } catch (e) {
      // TODO: retries?
      // await this.abort(AbortCode.unable_to_submit_transaction);
      throw new Error(AbortCode.unable_to_submit_transaction);
    }

    const readyForSettlementParams: ReadyForSettlementParams = {
      method: ReadyForSettlementParams.method.READY_FOR_SETTLEMENT,
      params: {
        referenceId: this.referenceId,
      },
    };

    await this.request(readyForSettlementParams);
    return response;
  }

  /**
   * Aborts a request
   */
  async abort(/*code: AbortCode, message?: string*/) {
    // await this.request(JsonRpcMethods.Abort, {
    //   referenceId: this.referenceId,
    //   abort_code: code,
    //   abort_message: message,
    // });
  }
}
