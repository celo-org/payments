/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';
import type { JsonRpcInvalidRequestError } from './JsonRpcInvalidRequestError';

export type JsonRpcInvalidRequestErrorResponse = (JsonRpcErrorResponse & {
    error: JsonRpcInvalidRequestError,
});
