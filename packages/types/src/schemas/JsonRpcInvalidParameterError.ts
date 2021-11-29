/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type JsonRpcInvalidParameterError = {
    /**
     * Invalid method parameter(s)
     */
    code?: JsonRpcInvalidParameterError.code;
}

export namespace JsonRpcInvalidParameterError {

    /**
     * Invalid method parameter(s)
     */
    export enum code {
        value = -32602
    }


}
