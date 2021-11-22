/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcSuccessResponse } from './JsonRpcSuccessResponse';
import type { PaymentInfo } from './PaymentInfo';

export type GetPaymentInfoResponse = (JsonRpcSuccessResponse & {
    result: PaymentInfo,
});
