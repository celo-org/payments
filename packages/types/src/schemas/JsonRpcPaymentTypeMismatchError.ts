/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Any } from './Any';

export type JsonRpcPaymentTypeMismatchError = {
    /**
     * Consumer tried to invoke an action that is irrelevant for the payment type
     *
     */
    code: JsonRpcPaymentTypeMismatchError.code;
    message?: string;
    data?: (Any | string | any[] | boolean | number);
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
