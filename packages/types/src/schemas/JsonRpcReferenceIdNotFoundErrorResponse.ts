/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';
import type { JsonRpcReferenceIdNotFoundError } from './JsonRpcReferenceIdNotFoundError';

export type JsonRpcReferenceIdNotFoundErrorResponse = (JsonRpcErrorResponse & {
    error: JsonRpcReferenceIdNotFoundError,
});
