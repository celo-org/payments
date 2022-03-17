/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';
import type { JsonRpcInvalidCommandTypeError } from './JsonRpcInvalidCommandTypeError';

export type JsonRpcInvalidCommandTypeErrorResponse = (JsonRpcErrorResponse & {
    error: JsonRpcInvalidCommandTypeError,
});
