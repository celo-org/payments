/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaymentSender } from './PaymentSender';
import type { ReferenceId } from './ReferenceId';

export type InitChargeParams = {
    sender: PaymentSender;
    referenceId: ReferenceId;
    /**
     * Transaction hash (pre-calculated), in Hex format
     */
    transactionHash: string;
}
