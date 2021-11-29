/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Any } from './Any';

export type JsonRpcMethodNotFoundError = {
    /**
     * Method not found
     */
    code: JsonRpcMethodNotFoundError.code;
    message?: string;
    data?: (Any | string | any[] | boolean | number);
}

export namespace JsonRpcMethodNotFoundError {

    /**
     * Method not found
     */
    export enum code {
        value = -32601
    }


}
