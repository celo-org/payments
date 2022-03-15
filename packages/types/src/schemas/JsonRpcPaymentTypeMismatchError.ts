/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type JsonRpcPaymentTypeMismatchError = {
    /**
     * Consumer tried to invoke an action that is irrelevant for the payment type
     *
     */
    code?: JsonRpcPaymentTypeMismatchError.code;
}

export namespace JsonRpcPaymentTypeMismatchError {

    /**
     * Consumer tried to invoke an action that is irrelevant for the payment type
     *
     */
    export enum code {
        value = -32004
    }


}
