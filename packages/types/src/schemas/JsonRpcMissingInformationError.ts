/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Any } from './Any';

export type JsonRpcMissingInformationError = {
    /**
     * A mandatory field or element are missing from the request
     *
     */
    code: JsonRpcMissingInformationError.code;
    message?: string;
    data?: Any;
}

export namespace JsonRpcMissingInformationError {

    /**
     * A mandatory field or element are missing from the request
     *
     */
    export enum code {
        value = -32003
    }


}
