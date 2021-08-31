/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcError } from './JsonRpcError';

export type JsonRpcMethodNotFoundError = (JsonRpcError & {
    /**
     * Method not found
     */
    code?: JsonRpcMethodNotFoundError.code,
});

export namespace JsonRpcMethodNotFoundError {

    /**
     * Method not found
     */
    export enum code {
        value = -32601
    }


}
