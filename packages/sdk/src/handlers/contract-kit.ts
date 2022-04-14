import { serializeSignature } from '@celo/base';
import { CeloTxObject, EncodedTransaction } from '@celo/connect';
import { ContractKit, StableToken } from '@celo/contractkit';
import { PaymentInfo } from '@celo/payments-types';
import { EIP712TypedData } from '@celo/utils/lib/sign-typed-data-utils';

import { pubToAddress } from 'ethereumjs-util';

import { ChainHandler } from './interface';
import { StableTokenWrapper } from '@celo/contractkit/lib/wrappers/StableTokenWrapper';
import BigNumber from 'bignumber.js';

interface InfoSignedTransaction {
  [referenceId: string]: {
    info: PaymentInfo;
    encoded: EncodedTransaction;
    nonce: string;
  };
}

export class SignedTxRepo {
  private txs: InfoSignedTransaction = {};

  async getSignedTransaction(
    info: PaymentInfo,
    signer: (info) => Promise<EncodedTransaction>
  ): Promise<EncodedTransaction> {
    if (this.txs.hasOwnProperty(info.referenceId)) {
      return this.txs[info.referenceId].encoded;
    }

    const encoded = await signer(info);
    this.txs[info.referenceId] = { info, encoded, nonce: encoded.tx.nonce };

    return encoded;
  }
}

/**
 * Implementation of the TransactionHandler that utilises ContractKit
 * as its mechanism to compute transaction hashes and submit transactions.
 */
export class ContractKitTransactionHandler implements ChainHandler {
  private static txsStorage: SignedTxRepo = new SignedTxRepo();
  private lastNonce: number;
  private readonly blockchainAddress: string;
  private dekAddressPromise: Promise<string>;

  constructor(private readonly kit: ContractKit, public gas = 1_000_000) {
    [this.blockchainAddress] = this.kit.getWallet().getAccounts();

    if (!this.blockchainAddress) {
      throw new Error('Missing defaultAccount');
    }

    void this.initializeDekAddress();
  }

  getSendingAddress = () => {
    return this.blockchainAddress;
  };

  private initializeDekAddress = async () => {
    if (!this.dekAddressPromise) {
      this.dekAddressPromise = this.getDekAddress();
    }

    await this.dekAddressPromise;
  };

  private getDekAddress = async () => {
    const accounts = await this.kit.contracts.getAccounts();
    const res = (
      await accounts.getDataEncryptionKey(this.blockchainAddress)
    ).slice(2);

    if (!res) {
      throw new Error('Missing DEK address.');
    }

    return `0x${pubToAddress(Buffer.from(res, 'hex')).toString('hex')}`;
  };

  private async getSignedTransaction(
    info: PaymentInfo
  ): Promise<EncodedTransaction> {
    return ContractKitTransactionHandler.txsStorage.getSignedTransaction(
      info,
      this.generateSignTransaction.bind(this)
    );
  }

  private async generateSignTransaction(
    info: PaymentInfo
  ): Promise<EncodedTransaction> {
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

    const txParams = await this.getTxParams(stable, gasPriceMinimum, txo);
    return wallet.signTransaction(txParams);
  }

  protected async getNonce() {
    return this.kit.connection.getTransactionCount(this.blockchainAddress);
  }

  protected async getTxParams(
    stable: StableTokenWrapper,
    gasPriceMinimum: BigNumber,
    txo: CeloTxObject<unknown>
  ) {
    const nonce = this.lastNonce ? this.lastNonce++ : await this.getNonce();

    return {
      to: stable.address,
      from: this.blockchainAddress,
      gas: this.gas,
      gasPrice: gasPriceMinimum.times(50).toString(),
      chainId: await this.kit.connection.chainId(),
      nonce,
      data: txo.encodeABI(),
      feeCurrency: stable.address,
      gatewayFeeRecipient: '0x',
      gatewayFee: '0x0',
    };
  }

  hasSufficientBalance = async (info: PaymentInfo) => {
    const { currency, amount: amntToSpend } = info.action;
    const sender = this.getSendingAddress();
    const balances = await this.kit.getTotalBalance(sender);
    return balances[currency].gte(amntToSpend);
  };

  computeTransactionHash = async (info: PaymentInfo) => {
    const {
      tx: { hash },
    } = await this.getSignedTransaction(info);
    return hash;
  };

  submitTransaction = async (info: PaymentInfo) => {
    const { raw } = await this.getSignedTransaction(info);
    const receipt = await (
      await this.kit.connection.sendSignedTransaction(raw)
    ).waitReceipt();

    return receipt.transactionHash;
  };

  signTypedPaymentRequest = async (typedData: EIP712TypedData) => {
    await this.initializeDekAddress();

    return serializeSignature(
      await this.kit.signTypedData(await this.dekAddressPromise, typedData)
    );
  };

  getChainId = () => {
    return this.kit.web3.eth.getChainId();
  };

  getDataEncryptionKey = async (account: string): Promise<string> => {
    const accounts = await this.kit.contracts.getAccounts();
    return accounts.getDataEncryptionKey(account);
  };
}
