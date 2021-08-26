/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Information regarding the type of payment and payment amount
 */
export type PaymentAction = {
    /**
     * Amount of the transfer. Base units are the same as for on-chain transactions for this currency.
     */
    amount: number;
    /**
     * One of the supported on-chain currency types, e.g. cUSD. At the moment, cUSD is the only allowed value.
     */
    currency: PaymentAction.currency;
    /**
     * This value indicates the requested action to perform. At the moment, charge is the only allowed value.
     */
    action: PaymentAction.action;
    /**
     * Unix timestamp indicating the time that the payment was created
     */
    timestamp: number;
}

export namespace PaymentAction {

    /**
     * One of the supported on-chain currency types, e.g. cUSD. At the moment, cUSD is the only allowed value.
     */
    export enum currency {
        C_USD = 'cUSD',
    }

    /**
     * This value indicates the requested action to perform. At the moment, charge is the only allowed value.
     */
    export enum action {
        CHARGE = 'charge',
    }


}
