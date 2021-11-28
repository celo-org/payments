/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';

export type JsonRpcPaymentTypeMismatchErrorResponse = (JsonRpcErrorResponse & {
    /**
     * Consumer tried to invoke an action that is irrelevant for the payment type
     *
     */
    code?: JsonRpcPaymentTypeMismatchErrorResponse.code,
});

export namespace JsonRpcPaymentTypeMismatchErrorResponse {

    /**
     * Consumer tried to invoke an action that is irrelevant for the payment type
     *
     */
    export enum code {
        value = -32004
    }


}
