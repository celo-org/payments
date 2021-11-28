/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';

export type JsonRpcInvalidCommandTypeErrorResponse = (JsonRpcErrorResponse & {
    error?: {
        /**
         * When trying to invoke an action out of its expected order (e.g. The wallet invoked ReadyForSettlement before payment was initialized)
         *
         */
        code?: JsonRpcInvalidCommandTypeErrorResponse.code,
    },
});

export namespace JsonRpcInvalidCommandTypeErrorResponse {

    /**
     * When trying to invoke an action out of its expected order (e.g. The wallet invoked ReadyForSettlement before payment was initialized)
     *
     */
    export enum code {
        value = -32005
    }


}
