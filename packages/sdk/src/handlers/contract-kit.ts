import { serializeSignature } from '@celo/base';
import { EncodedTransaction } from '@celo/connect';
import { ContractKit, StableToken } from '@celo/contractkit';
import { PaymentInfo } from '@celo/payments-types';
import { EIP712TypedData } from '@celo/utils/lib/sign-typed-data-utils';

import { ChainHandler } from './interface';

/**
 * Implementation of the TransactionHandler that utilises ContractKit
 * as its mechanism to compute transaction hashes and submit transactions.
 */
export class ContractKitTransactionHandler implements ChainHandler {
  private signedTransaction?: EncodedTransaction;
  private readonly blockchainAddress: string;
  private readonly dekAddress: string;

  constructor(private readonly kit: ContractKit) {
    [this.blockchainAddress, this.dekAddress] = this.kit
      .getWallet()
      .getAccounts();

    if (!this.blockchainAddress) {
      throw new Error('Missing defaultAccount');
    }
  }

  getSendingAddress = () => {
    return this.blockchainAddress;
  }

  private async getSignedTransaction(
    info: PaymentInfo
  ): Promise<EncodedTransaction> {
    if (this.signedTransaction) {
      return this.signedTransaction;
    }

    const wallet = this.kit.getWallet();
    if (!wallet) {
      throw new Error('Missing wallet');
    }

    const stable = await this.kit.contracts.getStableToken(
      info.action.currency as unknown as StableToken
    );

    const gasPriceMinimumWrapper =
      await this.kit.contracts.getGasPriceMinimum();
    const gasPriceMinimum = await gasPriceMinimumWrapper.gasPriceMinimum();

    const { txo } = stable.transfer(
      info.receiver.accountAddress,
      info.action.amount.toString()
    );

    this.signedTransaction = await wallet.signTransaction({
      to: stable.address,
      from: this.blockchainAddress,
      gas: 100_000,
      gasPrice: gasPriceMinimum.times(50).toString(),
      chainId: await this.kit.connection.chainId(),
      nonce: await this.kit.connection.getTransactionCount(
        this.blockchainAddress
      ),
      data: txo.encodeABI(),
      feeCurrency: stable.address,
      gatewayFeeRecipient: '0x',
      gatewayFee: '0x0',
    });

    return this.signedTransaction;
  }

  hasSufficientBalance = async (info: PaymentInfo) => {
    const { currency, amount: amntToSpend } = info.action;
    const sender = this.getSendingAddress();
    const balances = await this.kit.getTotalBalance(sender);
    return balances[currency].gte(amntToSpend);
  }

  computeTransactionHash = async (info: PaymentInfo) => {
    const {
      tx: { hash },
    } = await this.getSignedTransaction(info);
    return hash;
  }

  submitTransaction = async (info: PaymentInfo) => {
    const { raw } = await this.getSignedTransaction(info);
    const receipt = await (
      await this.kit.connection.sendSignedTransaction(raw)
    ).waitReceipt();

    return receipt.transactionHash;
  }

  signTypedPaymentRequest = async (typedData: EIP712TypedData) => {
    if (this.dekAddress) {
      return serializeSignature(
        await this.kit.signTypedData(this.dekAddress, typedData)
      );
    }
    return undefined;
  }

  getChainId = () => {
    return this.kit.web3.eth.getChainId();
  }

  getDataEncryptionKey = async (account: string): Promise<string> => {
    const accounts = await this.kit.contracts.getAccounts();
    return accounts.getDataEncryptionKey(account);
  }
}
