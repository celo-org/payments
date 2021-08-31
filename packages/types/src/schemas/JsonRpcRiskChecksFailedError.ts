/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcError } from './JsonRpcError';

export type JsonRpcRiskChecksFailedError = (JsonRpcError & {
    /**
     * The risk checks did not pass successfully
     *
     */
    code?: JsonRpcRiskChecksFailedError.code,
});

export namespace JsonRpcRiskChecksFailedError {

    /**
     * The risk checks did not pass successfully
     *
     */
    export enum code {
        value = -32002
    }


}
