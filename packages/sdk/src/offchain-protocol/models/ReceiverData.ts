/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BusinessData } from './BusinessData';

export type ReceiverData = {
    /**
     * The blockchain address of the receiver account
     */
    accountAddress?: string;
    businessData?: BusinessData;
}
