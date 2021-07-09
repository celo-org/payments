"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charge = void 0;
const base_1 = require("@celo/base");
const helpers_1 = require("./helpers");
var AbortCode;
(function (AbortCode) {
    AbortCode["reference_id_not_found"] = "reference_id_not_found";
    AbortCode["risk_checks_failed"] = "risk_checks_failed";
    AbortCode["missing_information"] = "missing_information";
    AbortCode["payment_type_mismatch"] = "payment_type_mismatch";
    AbortCode["invalid_command_type"] = "invalid_command_type";
    AbortCode["unspecified_error"] = "unspecified_error";
    AbortCode["unable_to_submit_transaction"] = "unable_to_submit_transaction";
})(AbortCode || (AbortCode = {}));
/**
 * Charge object for use in the Celo Payments Protocol
 */
class Charge {
    /**
     * Instantiates a new charge object for use in the Celo Payments Protocol
     *
     * @param baseUrl url of the payment service provider implementing the protocol
     * @param referenceId reference ID of the charge
     * @param transactionHandler handler to abstract away chain interaction semantics
     */
    constructor(baseUrl, referenceId, transactionHandler) {
        this.baseUrl = baseUrl;
        this.referenceId = referenceId;
        this.transactionHandler = transactionHandler;
    }
    /**
     * Instantiates a new charge object for use in the Celo Payments Protocol
     * from a URI, often encoded as part of a QR code.
     *
     * @param uri encoded URI with `baseUrl` and `referenceId`
     * @param transactionHandler handler to abstract away chain interaction semantics
     * @returns an instance of the Payments class
     */
    static fromUri(uri, transactionHandler) {
        const { baseUrl, referenceId } = helpers_1.parseUri(uri);
        return new Charge(baseUrl, referenceId, transactionHandler);
    }
    /**
     * Creates authenticated requests to the `baseUrl`
     *
     * @param route the endpoint to hit
     * @param method the HTTP method to use for the request
     * @param body optional body of the HTTP request
     */
    async request(route, method, body) {
        const response = await helpers_1.fetchWithRetries(`${this.baseUrl}${route}`, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            headers: {},
        });
        if (response.status >= 400) {
            // TODO: handle errors
            return base_1.Err(new Error(''));
        }
        if (response.status === 204) {
            return base_1.Ok(null);
        }
        try {
            return base_1.Ok(await response.json());
        }
        catch (e) {
            return base_1.Err(e);
        }
    }
    /**
     * Performs the GetInfo request of the Celo Payments Protocol.
     *
     * @returns
     */
    async getInfo() {
        const response = await this.request(`/purchases/${this.referenceId}`, 'GET');
        if (!response.ok) {
            throw new Error('');
        }
        // TODO: schema validation
        this.paymentInfo = response.result;
        return this.paymentInfo;
    }
    /**
     * Performs the InitCharge and ReadyForSettlement requests of the Celo Payments Protocol.
     *
     * @param kyc
     * @returns
     */
    async submit(kyc) {
        const transactionHash = await this.transactionHandler.computeHash(this.paymentInfo);
        const result = await this.request(`/purchases/${this.referenceId}`, 'POST', { kyc, transactionHash });
        // TODO: schema validation
        if (!result.ok) {
            throw new Error('');
        }
        try {
            await this.transactionHandler.submit(this.paymentInfo);
        }
        catch (e) {
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
    abort(code) {
        console.log(code);
    }
}
exports.Charge = Charge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcmdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2hhcmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUVyQyx1Q0FBdUQ7QUFHdkQsSUFBSyxTQVFKO0FBUkQsV0FBSyxTQUFTO0lBQ1osOERBQWlELENBQUE7SUFDakQsc0RBQXlDLENBQUE7SUFDekMsd0RBQTJDLENBQUE7SUFDM0MsNERBQStDLENBQUE7SUFDL0MsMERBQTZDLENBQUE7SUFDN0Msb0RBQXVDLENBQUE7SUFDdkMsMEVBQTZELENBQUE7QUFDL0QsQ0FBQyxFQVJJLFNBQVMsS0FBVCxTQUFTLFFBUWI7QUFFRDs7R0FFRztBQUNILE1BQWEsTUFBTTtJQUdqQjs7Ozs7O09BTUc7SUFDSCxZQUNVLE9BQWUsRUFDZixXQUFtQixFQUNuQixrQkFBc0M7UUFGdEMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQ25CLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7SUFDN0MsQ0FBQztJQUVKOzs7Ozs7O09BT0c7SUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQVcsRUFBRSxrQkFBc0M7UUFDaEUsTUFBTSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsR0FBRyxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSyxLQUFLLENBQUMsT0FBTyxDQUNuQixLQUFhLEVBQ2IsTUFBYyxFQUNkLElBQTJCO1FBRTNCLE1BQU0sUUFBUSxHQUFHLE1BQU0sMEJBQWdCLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxFQUFFO1lBQ2pFLE1BQU07WUFDTixJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFD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