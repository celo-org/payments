import { AbortCodes } from '@celo/payments-types';

export class OnchainFailureError extends Error {
  constructor(public code: AbortCodes, public rootError: Error) {
    super(`OnchainFailureError ${rootError.message} (abort code ${code})`);
  }
}
