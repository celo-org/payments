/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReferenceId } from './ReferenceId';

export type ReadyForSettlementParams = {
    /**
     * Method name
     */
    method?: ReadyForSettlementParams.method;
    params?: {
        referenceId: ReferenceId,
    };
}

export namespace ReadyForSettlementParams {

    /**
     * Method name
     */
    export enum method {
        READY_FOR_SETTLEMENT = 'readyForSettlement',
    }


}
