/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcError } from './JsonRpcError';

export type JsonRpcInvalidRequestError = (JsonRpcError & {
    /**
     * Invalid request
     */
    code?: JsonRpcInvalidRequestError.code,
});

export namespace JsonRpcInvalidRequestError {

    /**
     * Invalid request
     */
    export enum code {
        value = -32600
    }


}
