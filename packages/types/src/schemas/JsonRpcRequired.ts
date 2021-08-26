/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcProtocol } from './JsonRpcProtocol';

export type JsonRpcRequired = (JsonRpcProtocol & {
    /**
     * Method name
     */
    method: string,
});
