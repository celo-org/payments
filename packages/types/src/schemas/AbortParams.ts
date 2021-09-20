/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AbortCodes } from './AbortCodes';
import type { ReferenceId } from './ReferenceId';

export type AbortParams = {
    referenceId: ReferenceId;
    abortCode?: AbortCodes;
    /**
     * a descriptive message regarding the root cause for the abortion
     */
    abortMessage?: string;
}
