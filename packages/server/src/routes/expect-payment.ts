import { ReadyForSettlementParams } from "@celo/payments-types";
import { ResponseToolkit } from "@hapi/hapi";
import { get, has } from "../storage";
import { jsonRpcSuccess, paymentNotFound } from "../helpers/json-rpc-wrapper";
import { newKit } from "@celo/contractkit";

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
  const kit = newKit("https://alfajores-forno.celo-testnet.org");
  const transactionReceipt = await kit.connection.getTransactionReceipt(txHash);
  if (transactionReceipt) {
    console.log("Found matching tx for the given hash", {
      referenceId,
      txHash,
      transactionReceipt,
    });
    // TODO: implement verification of received funds
  } else {
    setTimeout(findTxHashInBlockchain, 2000, [referenceId, txHash]);
  }
}
