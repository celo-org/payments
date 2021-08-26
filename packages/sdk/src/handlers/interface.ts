import { GetInfoResponse } from '@celo/payments-types';

/**
 * Abstracts away complexity related to on chain interaction. Responsible
 * for computing transaction hashes and submitting transactions to the chain
 */
export interface ChainHandler {
  /**
   * Compute the transaction hash for a given charge.
   *
   * This will be used to notify PSPs ahead of time for a transaction
   * hash they can listen for.
   */
  computeTransactionHash: (tx: GetInfoResponse) => Promise<string>;
  /**
   * Submit the transaction and return the hash for a given charge.
   */
  submitTransaction: (tx: GetInfoResponse) => Promise<string>;
  /**
   * Compute an EIP712 signature over the payment request.
   */
  signTypedPaymentRequest: (data: any) => Promise<string>;
  /**
   * Get the address of the sender submitting this transaction to the chain
   */
  getSendingAddress: () => string;
  getChainId: () => Promise<number>;
}
