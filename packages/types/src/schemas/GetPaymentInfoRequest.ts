/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GetPaymentInfoParams } from './GetPaymentInfoParams';

export type GetPaymentInfoRequest = {
    /**
     * Method name
     */
    method: GetPaymentInfoRequest.method;
    params: GetPaymentInfoParams;
}

export namespace GetPaymentInfoRequest {

    /**
     * Method name
     */
    export enum method {
        GET_PAYMENT_INFO = 'getPaymentInfo',
    }


}
