/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Any } from './Any';

export type JsonRpcInvalidSignatureError = {
    /**
     * Signature header missing or could not be verified
     *
     */
    code: JsonRpcInvalidSignatureError.code;
    message?: string;
    data?: (Any | string | any[] | boolean | number);
}

export namespace JsonRpcInvalidSignatureError {

    /**
     * Signature header missing or could not be verified
     *
     */
    export enum code {
        value = -32006
    }


}
