/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonRpcProtocol } from './JsonRpcProtocol';
import type { PaymentInfo } from './PaymentInfo';

export type GetPaymentInfoResponse = (JsonRpcProtocol & {
    result?: PaymentInfo,
});
