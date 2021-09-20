/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AbortParams } from './AbortParams';

export type AbortRequest = {
    /**
     * Method name
     */
    method: AbortRequest.method;
    params: AbortParams;
}

export namespace AbortRequest {

    /**
     * Method name
     */
    export enum method {
        value = "abort"
    }


}
