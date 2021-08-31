/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcError } from './JsonRpcError';

export type JsonRpcUnspecifiedError = (JsonRpcError & {
    /**
     * Unspecified error
     *
     */
    code?: JsonRpcUnspecifiedError.code,
});

export namespace JsonRpcUnspecifiedError {

    /**
     * Unspecified error
     *
     */
    export enum code {
        value = -32000
    }


}
