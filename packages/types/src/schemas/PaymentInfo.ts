/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaymentAction } from './PaymentAction';
import type { ReceiverData } from './ReceiverData';
import type { ReferenceId } from './ReferenceId';
import type { RequiredPayerData } from './RequiredPayerData';

export type PaymentInfo = {
    requiredPayerData?: RequiredPayerData;
    receiver: ReceiverData;
    action: PaymentAction;
    referenceId: ReferenceId;
    /**
     * Description of the payment. To be displayed to the customer
     */
    description?: string;
}
