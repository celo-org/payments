/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcErrorResponse } from './JsonRpcErrorResponse';
import type { JsonRpcMissingInformationError } from './JsonRpcMissingInformationError';

export type JsonRpcMissingInformationErrorResponse = (JsonRpcErrorResponse & {
    error?: JsonRpcMissingInformationError,
});
