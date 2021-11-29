/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type JsonRpcRiskChecksFailedError = {
    /**
     * The risk checks did not pass successfully
     *
     */
    code?: JsonRpcRiskChecksFailedError.code;
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
