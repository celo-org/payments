/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReferenceId } from './ReferenceId';

export type GetPaymentInfoParams = {
    /**
     * Method name
     */
    method?: GetPaymentInfoParams.method;
    params?: {
        referenceId: ReferenceId,
    };
}

export namespace GetPaymentInfoParams {

    /**
     * Method name
     */
    export enum method {
        GET_PAYMENT_INFO = 'getPaymentInfo',
    }


}
