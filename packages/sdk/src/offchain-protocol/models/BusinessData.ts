/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Address } from './Address';

/**
 * Includes the details of the merchant to be displayed to the payer
 */
export type BusinessData = {
    /**
     * Merchant's display name. Should be recognizable by the payer
     */
    name?: string;
    /**
     * The legal entity name
     */
    legalName?: string;
    /**
     * URL with the business logo
     */
    imageUrl?: string;
    address?: Address;
}
