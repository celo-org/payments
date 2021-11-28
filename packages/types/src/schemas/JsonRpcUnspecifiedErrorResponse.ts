/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';

export type JsonRpcUnspecifiedErrorResponse = (JsonRpcErrorResponse & {
    /**
     * Unspecified error
     *
     */
    code?: JsonRpcUnspecifiedErrorResponse.code,
});

export namespace JsonRpcUnspecifiedErrorResponse {

    /**
     * Unspecified error
     *
     */
    export enum code {
        value = -32000
    }


}
