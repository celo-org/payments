import { EIP712Schemas, ReadyForSettlementParams } from "@celo/payments-types";
import { ResponseToolkit } from "@hapi/hapi";
import { get, has } from "../storage";
import { jsonRpcSuccess, paymentNotFound } from "../helpers/json-rpc-wrapper";
import AbiDecoder from "abi-decoder";
import ERC20 from "../abis/ERC20.json";
import { getKit } from "../services";
import { ChainHandler } from "@celo/payments-sdk";

AbiDecoder.addABI(ERC20);

export function expectPayment(
  jsonRpcRequestId: number,
  params: ReadyForSettlementParams,
  chainHandler: ChainHandler,
  res: ResponseToolkit
) {
  if (!has(params.referenceId)) {
    return paymentNotFound(
      res,
      jsonRpcRequestId,
      chainHandler,
      params.referenceId
    );
  }

  const payment = get(params.referenceId);
  setImmediate(findTxHashInBlockchain, [
    payment.referenceId,
    payment.transactionHash,
  ]);

  return jsonRpcSuccess(
    res,
    jsonRpcRequestId,
    chainHandler,
    EIP712Schemas.ReadyForSettlementResponse
  );
}

async function findTxHashInBlockchain([referenceId, txHash]: [
  refId: string,
  txHash: string
]) {
  const kit = await getKit();
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
