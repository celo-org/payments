"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractKitTransactionHandler = void 0;
/**
 * Implementation of the TransactionHandler that utilises ContractKit
 * as its mechanism to compute transaction hashes and submit transactions.
 */
class ContractKitTransactionHandler {
    constructor(kit) {
        this.kit = kit;
    }
    async computeHash(info) {
        const wallet = this.kit.getWallet();
        if (!wallet) {
            throw new Error('Missing wallet');
        }
        const stable = await this.kit.contracts.getStableToken(info.action.currency);
        const { txo, defaultParams } = await stable.transfer(info.receiver.account_address, this.kit.web3.utils.toWei(info.action.amount));
        const { tx: { hash }, } = await wallet.signTransaction(Object.assign(Object.assign({ to: stable.address, from: this.kit.defaultAccount }, defaultParams), { data: txo.encodeABI() }));
        return hash;
    }
    async submit(info) {
        const wallet = this.kit.getWallet();
        if (!wallet) {
            throw new Error('Missing wallet');
        }
        const stable = await this.kit.contracts.getStableToken(info.action.currency);
        const { transactionHash } = await stable
            .transfer(info.receiver.account_address, this.kit.web3.utils.toWei(info.action.amount))
            .sendAndWaitForReceipt();
        return transactionHash;
    }
}
exports.ContractKitTransactionHandler = ContractKitTransactionHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3Qta2l0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29udHJhY3Qta2l0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBOzs7R0FHRztBQUNILE1BQWEsNkJBQTZCO0lBQ3hDLFlBQW9CLEdBQWdCO1FBQWhCLFFBQUcsR0FBSCxHQUFHLENBQWE7SUFBRyxDQUFDO0lBRXhDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBYTtRQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDbkM7UUFFRCxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FDcEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFrQyxDQUMvQyxDQUFDO1FBQ0YsTUFBTSxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxRQUFRLENBQ2xELElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQzlDLENBQUM7UUFFRixNQUFNLEVBQ0osRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQ2IsR0FBRyxNQUFNLE1BQU0sQ0FBQyxlQUFlLCtCQUM5QixFQUFFLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFDbEIsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxJQUMxQixhQUFhLEtBQ2hCLElBQUksRUFBRSxHQUFHLENBQUMsU0FBUyxFQUFFLElBQ3JCLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTSxDQUFDLElBQWE7UUFDeEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ25DO1FBRUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQ3BELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBa0MsQ0FDL0MsQ0FBQztRQUNGLE1BQU0sRUFBRSxlQUFlLEVBQUUsR0FBRyxNQUFNLE1BQU07YUFDckMsUUFBUSxDQUNQLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQzlDO2FBQ0EscUJBQXFCLEVBQUUsQ0FBQztRQUUzQixPQUFPLGVBQWUsQ0FBQztJQUN6QixDQUFDO0NBQ0Y7QUEvQ0Qsc0VBK0NDIn0=