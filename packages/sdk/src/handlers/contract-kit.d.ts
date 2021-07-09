import { ContractKit } from '@celo/contractkit';
import { GetInfo } from '../schemas';
import { TransactionHandler } from './interface';
/**
 * Implementation of the TransactionHandler that utilises ContractKit
 * as its mechanism to compute transaction hashes and submit transactions.
 */
export declare class ContractKitTransactionHandler implements TransactionHandler {
    private kit;
    constructor(kit: ContractKit);
    computeHash(info: GetInfo): Promise<string>;
    submit(info: GetInfo): Promise<string>;
}
