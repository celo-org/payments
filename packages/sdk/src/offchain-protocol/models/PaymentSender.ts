/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PayerData } from './PayerData';

export type PaymentSender = {
    /**
     * Address of the customer/wallet
     */
    accountAddress: string;
    payerData: PayerData;
}
