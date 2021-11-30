/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Any } from './Any';

export type JsonRpcError = {
    code: number;
    message?: string;
    data?: Any;
}
