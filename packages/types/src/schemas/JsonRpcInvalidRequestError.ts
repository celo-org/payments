/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Any } from './Any';

export type JsonRpcInvalidRequestError = {
    /**
     * Invalid request
     */
    code: JsonRpcInvalidRequestError.code;
    message?: string;
    data?: Any;
}

export namespace JsonRpcInvalidRequestError {

    /**
     * Invalid request
     */
    export enum code {
        value = -32600
    }


}
