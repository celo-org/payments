/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';

export type JsonRpcRiskChecksFailedErrorResponse = (JsonRpcErrorResponse & {
    /**
     * The risk checks did not pass successfully
     *
     */
    code?: JsonRpcRiskChecksFailedErrorResponse.code,
});

export namespace JsonRpcRiskChecksFailedErrorResponse {

    /**
     * The risk checks did not pass successfully
     *
     */
    export enum code {
        value = -32002
    }


}
