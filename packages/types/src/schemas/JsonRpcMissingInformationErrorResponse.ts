/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';

export type JsonRpcMissingInformationErrorResponse = (JsonRpcErrorResponse & {
    /**
     * A mandatory field or element are missing from the request
     *
     */
    code?: JsonRpcMissingInformationErrorResponse.code,
});

export namespace JsonRpcMissingInformationErrorResponse {

    /**
     * A mandatory field or element are missing from the request
     *
     */
    export enum code {
        value = -32003
    }


}
