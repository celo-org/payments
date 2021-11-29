/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Any } from './Any';

export type JsonRpcInvalidParameterError = {
    /**
     * Invalid method parameter(s)
     */
    code: JsonRpcInvalidParameterError.code;
    message?: string;
    data?: (Any | string | any[] | boolean | number);
}

export namespace JsonRpcInvalidParameterError {

    /**
     * Invalid method parameter(s)
     */
    export enum code {
        value = -32602
    }


}
