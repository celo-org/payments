/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';

export type JsonRpcReferenceIdNotFoundErrorResponse = (JsonRpcErrorResponse & {
    /**
     * The reference id provided in the request was not found
     *
     */
    code?: JsonRpcReferenceIdNotFoundErrorResponse.code,
});

export namespace JsonRpcReferenceIdNotFoundErrorResponse {

    /**
     * The reference id provided in the request was not found
     *
     */
    export enum code {
        value = -32001
    }


}
