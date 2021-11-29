/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';
import type { JsonRpcPaymentTypeMismatchError } from './JsonRpcPaymentTypeMismatchError';

export type JsonRpcPaymentTypeMismatchErrorResponse = (JsonRpcErrorResponse & {
    error?: JsonRpcPaymentTypeMismatchError,
});
