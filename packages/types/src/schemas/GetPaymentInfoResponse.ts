/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GetPaymentInfoResponseData } from './GetPaymentInfoResponseData';
import type { JsonRpcProtocol } from './JsonRpcProtocol';

export type GetPaymentInfoResponse = (JsonRpcProtocol & {
    result?: GetPaymentInfoResponseData,
});
