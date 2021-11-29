/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type JsonRpcMethodNotFoundError = {
    /**
     * Method not found
     */
    code?: JsonRpcMethodNotFoundError.code;
}

export namespace JsonRpcMethodNotFoundError {

    /**
     * Method not found
     */
    export enum code {
        value = -32601
    }


}
