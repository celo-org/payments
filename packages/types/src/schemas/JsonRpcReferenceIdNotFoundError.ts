/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Any } from './Any';

export type JsonRpcReferenceIdNotFoundError = {
    /**
     * The reference id provided in the request was not found
     *
     */
    code: JsonRpcReferenceIdNotFoundError.code;
    message?: string;
    data?: Any;
}

export namespace JsonRpcReferenceIdNotFoundError {

    /**
     * The reference id provided in the request was not found
     *
     */
    export enum code {
        value = -32001
    }


}
