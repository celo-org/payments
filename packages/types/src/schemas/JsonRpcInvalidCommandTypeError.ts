/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type JsonRpcInvalidCommandTypeError = {
    /**
     * When trying to invoke an action out of its expected order (e.g. The wallet invoked ReadyForSettlement before payment was initialized)
     *
     */
    code?: JsonRpcInvalidCommandTypeError.code;
}

export namespace JsonRpcInvalidCommandTypeError {

    /**
     * When trying to invoke an action out of its expected order (e.g. The wallet invoked ReadyForSettlement before payment was initialized)
     *
     */
    export enum code {
        value = -32005
    }


}
