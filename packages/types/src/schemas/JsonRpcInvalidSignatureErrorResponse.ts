/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';
import type { JsonRpcInvalidSignatureError } from './JsonRpcInvalidSignatureError';

export type JsonRpcInvalidSignatureErrorResponse = (JsonRpcErrorResponse & {
    error?: JsonRpcInvalidSignatureError,
});
