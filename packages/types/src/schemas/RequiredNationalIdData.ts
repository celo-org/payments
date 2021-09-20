/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Defines which elements of the payer national ID data are required for this payment.
 * The absence of properties indicates their optionality (default to false)
 *
 */
export type RequiredNationalIdData = {
    idValue?: boolean;
    country?: boolean;
    type?: boolean;
}
