/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';
import type { JsonRpcUnspecifiedError } from './JsonRpcUnspecifiedError';

export type JsonRpcUnspecifiedErrorResponse = (JsonRpcErrorResponse & {
    error?: JsonRpcUnspecifiedError,
});
