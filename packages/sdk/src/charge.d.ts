import { TransactionHandler } from './handlers/interface';
import { GetInfo } from './schemas';
declare enum AbortCode {
    reference_id_not_found = "reference_id_not_found",
    risk_checks_failed = "risk_checks_failed",
    missing_information = "missing_information",
    payment_type_mismatch = "payment_type_mismatch",
    invalid_command_type = "invalid_command_type",
    unspecified_error = "unspecified_error",
    unable_to_submit_transaction = "unable_to_submit_transaction"
}
/**
 * Charge object for use in the Celo Payments Protocol
 */
export declare class Charge {
    private baseUrl;
    private referenceId;
    private transactionHandler;
    private paymentInfo?;
    /**
     * Instantiates a new charge object for use in the Celo Payments Protocol
     *
     * @param baseUrl url of the payment service provider implementing the protocol
     * @param referenceId reference ID of the charge
     * @param transactionHandler handler to abstract away chain interaction semantics
     */
    constructor(baseUrl: string, referenceId: string, transactionHandler: TransactionHandler);
    /**
     * Instantiates a new charge object for use in the Celo Payments Protocol
     * from a URI, often encoded as part of a QR code.
     *
     * @param uri encoded URI with `baseUrl` and `referenceId`
     * @param transactionHandler handler to abstract away chain interaction semantics
     * @returns an instance of the Payments class
     */
    static fromUri(uri: string, transactionHandler: TransactionHandler): Charge;
    /**
     * Creates authenticated requests to the `baseUrl`
     *
     * @param route the endpoint to hit
     * @param method the HTTP method to use for the request
     * @param body optional body of the HTTP request
     */
    private request;
    /**
     * Performs the GetInfo request of the Celo Payments Protocol.
     *
     * @returns
     */
    getInfo(): Promise<GetInfo>;
    /**
     * Performs the InitCharge and ReadyForSettlement requests of the Celo Payments Protocol.
     *
     * @param kyc
     * @returns
     */
    submit(kyc: {
        [x: string]: any;
    }): Promise<import("@celo/base").OkResult<any>>;
    /**
     * Aborts a request
     */
    abort(code: AbortCode): void;
}
export {};
