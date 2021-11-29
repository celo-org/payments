/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type JsonRpcReferenceIdNotFoundError = {
    /**
     * The reference id provided in the request was not found
     *
     */
    code?: JsonRpcReferenceIdNotFoundError.code;
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
