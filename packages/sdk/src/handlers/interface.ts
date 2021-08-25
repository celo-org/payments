import { GetInfo } from '../schemas';

/**
 * Abstracts away complexity related to on chain interaction. Responsible
 * for computing transaction hashes and submitting transactions to the chain
 */
export interface BlockChainHandler {
  /**
   * Compute the transaction hash for a given charge.
   *
   * This will be used to notify PSPs ahead of time for a transaction
   * hash they can listen for.
   */
  computeTransactionHash: (tx: GetInfo) => Promise<string>;
  /**
   * Submit the transaction and return the hash for a given charge.
   */
  submitTransaction: (tx: GetInfo) => Promise<string>;
  /**
   * Get the address of the sender submitting this transaction to the chain
   */
  getSendingAddress: () => Promise<string>;
}
