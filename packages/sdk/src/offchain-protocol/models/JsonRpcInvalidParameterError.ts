/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcError } from './JsonRpcError';

export type JsonRpcInvalidParameterError = (JsonRpcError & {
    /**
     * Invalid method parameter(s)
     */
    code?: JsonRpcInvalidParameterError.code,
});

export namespace JsonRpcInvalidParameterError {

    /**
     * Invalid method parameter(s)
     */
    export enum code {
        '_-32602' = -32602,
    }


}
