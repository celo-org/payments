/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReadyForSettlementParams } from './ReadyForSettlementParams';

export type ReadyForSettlementRequest = {
    /**
     * Method name
     */
    method: ReadyForSettlementRequest.method;
    params: ReadyForSettlementParams;
}

export namespace ReadyForSettlementRequest {

    /**
     * Method name
     */
    export enum method {
        READY_FOR_SETTLEMENT = 'readyForSettlement',
    }


}
