/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Any } from './Any';

export type JsonRpcRiskChecksFailedError = {
    /**
     * The risk checks did not pass successfully
     *
     */
    code: JsonRpcRiskChecksFailedError.code;
    message?: string;
    data?: Any;
}

export namespace JsonRpcRiskChecksFailedError {

    /**
     * The risk checks did not pass successfully
     *
     */
    export enum code {
        value = -32002
    }


}
