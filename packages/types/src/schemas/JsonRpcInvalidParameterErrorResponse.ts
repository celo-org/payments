/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';

export type JsonRpcInvalidParameterErrorResponse = (JsonRpcErrorResponse & {
    /**
     * Invalid method parameter(s)
     */
    code?: JsonRpcInvalidParameterErrorResponse.code,
});

export namespace JsonRpcInvalidParameterErrorResponse {

    /**
     * Invalid method parameter(s)
     */
    export enum code {
        value = -32602
    }


}
