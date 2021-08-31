/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcError } from './JsonRpcError';

export type JsonRpcMissingInformationError = (JsonRpcError & {
    /**
     * A mandatory field or element are missing from the request
     *
     */
    code?: JsonRpcMissingInformationError.code,
});

export namespace JsonRpcMissingInformationError {

    /**
     * A mandatory field or element are missing from the request
     *
     */
    export enum code {
        value = -32003
    }


}
