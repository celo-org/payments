/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RequiredAddressData } from './RequiredAddressData';
import type { RequiredNationalIdData } from './RequiredNationalIdData';

/**
 * Defines which elements of the payer data are required for this payment.
 * The absence of properties indicates their optionality
 *
 */
export type RequiredPayerData = {
    givenName: boolean;
    surname: boolean;
    phoneNumber: boolean;
    address: RequiredAddressData;
    nationalIdData: RequiredNationalIdData;
}
