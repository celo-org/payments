/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Address } from './Address';
import type { NationalIdData } from './NationalIdData';

export type PayerData = {
    /**
     * Given name of the payer
     */
    givenName?: string;
    /**
     * Surname of the payer
     */
    surname?: string;
    /**
     * Phone number of the payer
     */
    phoneNumber?: string;
    address?: Address;
    nationalIdData?: NationalIdData;
}
