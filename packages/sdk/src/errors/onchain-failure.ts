import { AbortCodes } from '@celo/payments-types';

export class OnchainFailureError extends Error {
  constructor(public code: AbortCodes, message?: string) {
    super(message);
  }
}
