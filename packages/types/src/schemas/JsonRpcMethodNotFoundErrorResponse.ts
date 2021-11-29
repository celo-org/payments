/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';
import type { JsonRpcMethodNotFoundError } from './JsonRpcMethodNotFoundError';

export type JsonRpcMethodNotFoundErrorResponse = (JsonRpcErrorResponse & {
    error?: JsonRpcMethodNotFoundError,
});
