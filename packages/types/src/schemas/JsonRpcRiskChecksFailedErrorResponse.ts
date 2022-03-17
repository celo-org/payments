/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';
import type { JsonRpcRiskChecksFailedError } from './JsonRpcRiskChecksFailedError';

export type JsonRpcRiskChecksFailedErrorResponse = (JsonRpcErrorResponse & {
    error: JsonRpcRiskChecksFailedError,
});
