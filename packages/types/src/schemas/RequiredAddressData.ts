/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Defines which elements of the payer address data are required for this payment.
 * The absence of properties indicates their optionality (default to false)
 *
 */
export type RequiredAddressData = {
    city?: boolean;
    country?: boolean;
    line1?: boolean;
    line2?: boolean;
    postalCode?: boolean;
    state?: boolean;
}
