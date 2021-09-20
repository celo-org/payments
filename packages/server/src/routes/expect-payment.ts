import { ReadyForSettlementParams } from "@celo/payments-types";
import { ResponseToolkit } from "@hapi/hapi";
import { get, has } from "../storage";
import { jsonRpcSuccess, paymentNotFound } from "../helpers/json-rpc-wrapper";
import { newKit } from "@celo/contractkit";
import AbiDecoder from "abi-decoder";
import ERC20 from "../abis/ERC20.json";

AbiDecoder.addABI(ERC20);

const kit = newKit("https://alfajores-forno.celo-testnet.org");

export function expectPayment(
  jsonRpcRequestId: number,
  params: ReadyForSettlementParams,
  res: ResponseToolkit
) {
  if (!has(params.referenceId)) {
    return paymentNotFound(res, jsonRpcRequestId, params.referenceId);
  }

  console.log("expectPayment", params);

  const payment = get(params.referenceId);
  setImmediate(findTxHashInBlockchain, [
    payment.referenceId,
    payment.transactionHash,
  ]);

  return jsonRpcSuccess(res, jsonRpcRequestId);
}

async function findTxHashInBlockchain([referenceId, txHash]: [
  refId: string,
  txHash: string
]) {
  const tx = await kit.web3.eth.getTransaction(txHash);
  if (tx) {
    console.log("Found matching tx for the given hash");
    console.log("Decoding transaction", tx.hash);
    console.log("Decoded", AbiDecoder.decodeMethod(tx.input));
    const receipt = await kit.web3.eth.getTransactionReceipt(txHash);
    console.log("Transaction receipt: ", receipt);

    // TODO: implement verification of received funds
  } else {
    setTimeout(findTxHashInBlockchain, 2000, [referenceId, txHash]);
  }
}
