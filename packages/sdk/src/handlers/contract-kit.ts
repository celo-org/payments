import { ContractKit, StableToken } from '@celo/contractkit';
import { GetInfo } from '../schemas';
import { TransactionHandler } from './interface';

/**
 * Implementation of the TransactionHandler that utilises ContractKit
 * as its mechanism to compute transaction hashes and submit transactions.
 */
export class ContractKitTransactionHandler implements TransactionHandler {
  constructor(private kit: ContractKit) {}

  async computeHash(info: GetInfo) {
    const wallet = this.kit.getWallet();
    if (!wallet) {
      throw new Error('Missing wallet');
    }

    const stable = await this.kit.contracts.getStableToken(
      info.action.currency as unknown as StableToken
    );
    const { txo, defaultParams } = await stable.transfer(
      info.receiver.account_address,
      this.kit.web3.utils.toWei(info.action.amount)
    );

    const {
      tx: { hash },
    } = await wallet.signTransaction({
      to: stable.address,
      from: this.kit.defaultAccount,
      ...defaultParams,
      data: txo.encodeABI(),
    });

    return hash;
  }

  async submit(info: GetInfo) {
    const wallet = this.kit.getWallet();
    if (!wallet) {
      throw new Error('Missing wallet');
    }

    const stable = await this.kit.contracts.getStableToken(
      info.action.currency as unknown as StableToken
    );
    const { transactionHash } = await stable
      .transfer(
        info.receiver.account_address,
        this.kit.web3.utils.toWei(info.action.amount)
      )
      .sendAndWaitForReceipt();

    return transactionHash;
  }
}
