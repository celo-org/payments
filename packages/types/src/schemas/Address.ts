/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Address = {
    /**
     * The city, district, suburb, town, or village
     */
    city?: string;
    /**
     * Two-letter (ISO country code)[https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2]
     */
    country?: string;
    /**
     * Address line 1
     */
    line1?: string;
    /**
     * Address line 2 - apartment, unit, etc.
     */
    line2?: string;
    /**
     * ZIP or postal code
     */
    postalCode?: string;
    /**
     * State, county, province, region
     */
    state?: string;
}
