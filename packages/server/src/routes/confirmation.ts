import { ResponseToolkit } from "@hapi/hapi";
import { newKit } from "@celo/contractkit";
import { get } from "../storage";
import AbiDecoder from "abi-decoder";
import ERC20 from "../abis/ERC20.json";
import { ConfirmRequest } from "@celo/payments-types";

AbiDecoder.addABI(ERC20);

const kit = newKit("https://alfajores-forno.celo-testnet.org");

export async function confirmation(
  { params: { referenceId } }: ConfirmRequest,
  res: ResponseToolkit
) {
  console.log("confirmation", { referenceId });

  const item = get(referenceId);
  if (!item) {
    return res.response().code(404);
  }

  const tx = await kit.web3.eth.getTransaction(item.transactionHash);
  console.log("Decoding transaction", tx.hash);
  console.log("Decoded", AbiDecoder.decodeMethod(tx.input));

  return res.response().code(200);
}
