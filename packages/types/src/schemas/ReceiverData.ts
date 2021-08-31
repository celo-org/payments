/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BusinessData } from './BusinessData';

/**
 * The details of the payment receiver (e.g. merchant)
 */
export type ReceiverData = {
    /**
     * The blockchain address of the receiver account
     */
    accountAddress: string;
    businessData: BusinessData;
}
