/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';

export type JsonRpcInvalidRequestErrorResponse = (JsonRpcErrorResponse & {
    /**
     * Invalid request
     */
    code?: JsonRpcInvalidRequestErrorResponse.code,
});

export namespace JsonRpcInvalidRequestErrorResponse {

    /**
     * Invalid request
     */
    export enum code {
        value = -32600
    }


}
