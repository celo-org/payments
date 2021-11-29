/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type JsonRpcInvalidRequestError = {
    /**
     * Invalid request
     */
    code?: JsonRpcInvalidRequestError.code;
}

export namespace JsonRpcInvalidRequestError {

    /**
     * Invalid request
     */
    export enum code {
        value = -32600
    }


}
