/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';

export type JsonRpcMethodNotFoundErrorResponse = (JsonRpcErrorResponse & {
    /**
     * Method not found
     */
    code?: JsonRpcMethodNotFoundErrorResponse.code,
});

export namespace JsonRpcMethodNotFoundErrorResponse {

    /**
     * Method not found
     */
    export enum code {
        value = -32601
    }


}
