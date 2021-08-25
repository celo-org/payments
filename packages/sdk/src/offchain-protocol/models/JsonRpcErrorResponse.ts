/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcError } from './JsonRpcError';
import type { JsonRpcProtocol } from './JsonRpcProtocol';

export type JsonRpcErrorResponse = (JsonRpcProtocol & {
    error: JsonRpcError,
});
