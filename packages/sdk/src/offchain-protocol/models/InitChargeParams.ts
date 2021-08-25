/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaymentSender } from './PaymentSender';
import type { ReferenceId } from './ReferenceId';

export type InitChargeParams = {
    /**
     * Method name
     */
    method?: InitChargeParams.method;
    params?: {
        sender: PaymentSender,
        referenceId: ReferenceId,
        /**
         * Transaction hash (pre-calculated), in Hex format
         */
        transactionHash: string,
    };
}

export namespace InitChargeParams {

    /**
     * Method name
     */
    export enum method {
        INIT_CHARGE = 'initCharge',
    }


}
