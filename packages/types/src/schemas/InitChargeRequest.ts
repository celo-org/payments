/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { InitChargeParams } from './InitChargeParams';

export type InitChargeRequest = {
    /**
     * Method name
     */
    method?: InitChargeRequest.method;
    params?: InitChargeParams;
}

export namespace InitChargeRequest {

    /**
     * Method name
     */
    export enum method {
        INIT_CHARGE = 'initCharge',
    }


}
