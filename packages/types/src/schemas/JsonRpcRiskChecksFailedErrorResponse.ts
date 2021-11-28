/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';

export type JsonRpcRiskChecksFailedErrorResponse = (JsonRpcErrorResponse & {
    error?: {
        /**
         * The risk checks did not pass successfully
         *
         */
        code?: JsonRpcRiskChecksFailedErrorResponse.code,
    },
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
