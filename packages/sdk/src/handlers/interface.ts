import { PaymentInfo } from '@celo/payments-types';

/**
 * Abstracts away complexity related to on chain interaction. Responsible
 * for computing transaction hashes and submitting transactions to the chain
 */

export interface ChainHandlerForAuthentication {
  /**
   * Compute an EIP712 signature over the payment request.
   */
  // "any" type fixed in the authorization PR
  // eslint-disable-next-line
  signTypedPaymentRequest: (data: any) => Promise<string | undefined>;
  /**
   * Get the address of the sender submitting this transaction to the chain
   */
  getSendingAddress: () => string;

  getChainId: () => Promise<number>;

  getDataEncryptionKey: (account: string) => Promise<string>;
}

export interface ChainHandler extends ChainHandlerForAuthentication {
  hasSufficientBalance: (info: PaymentInfo) => Promise<boolean>;
  /**
   * Compute the transaction hash for a given charge.
   *
   * This will be used to notify PSPs ahead of time for a transaction
   * hash they can listen for.
   */
  computeTransactionHash: (tx: PaymentInfo) => Promise<string>;
  /**
   * Submit the transaction and return the hash for a given charge.
   */
  submitTransaction: (tx: PaymentInfo) => Promise<string>;
}
