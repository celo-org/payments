/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';

export type JsonRpcInvalidSignatureErrorResponse = (JsonRpcErrorResponse & {
    error?: {
        /**
         * Signature header missing or could not be verified
         *
         */
        code?: JsonRpcInvalidSignatureErrorResponse.code,
    },
});

export namespace JsonRpcInvalidSignatureErrorResponse {

    /**
     * Signature header missing or could not be verified
     *
     */
    export enum code {
        value = -32006
    }


}
