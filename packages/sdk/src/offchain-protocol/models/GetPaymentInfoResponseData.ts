/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaymentAction } from './PaymentAction';
import type { ReceiverData } from './ReceiverData';
import type { ReferenceId } from './ReferenceId';
import type { RequiredPayerData } from './RequiredPayerData';

export type GetPaymentInfoResponseData = {
    requiredPayerData?: RequiredPayerData;
    receiver?: ReceiverData;
    action?: PaymentAction;
    referenceId?: ReferenceId;
    description?: string;
}
