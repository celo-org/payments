/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcError } from './JsonRpcError';

export type JsonRpcInvalidSignatureError = (JsonRpcError & {
    /**
     * Signature header missing or could not be verified
     *
     */
    code?: JsonRpcInvalidSignatureError.code,
});

export namespace JsonRpcInvalidSignatureError {

    /**
     * Signature header missing or could not be verified
     *
     */
    export enum code {
        value = -32006
    }


}
