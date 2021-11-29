/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';
import type { JsonRpcInvalidParameterError } from './JsonRpcInvalidParameterError';

export type JsonRpcInvalidParameterErrorResponse = (JsonRpcErrorResponse & {
    error: JsonRpcInvalidParameterError,
});
