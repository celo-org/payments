import { PaymentMessageRequest } from "@celo/payments-types";
import { buildTypedPaymentRequest } from "@celo/payments-utils";
import { AddressUtils } from "@celo/utils";
import { verifyEIP712TypedDataSigner } from "@celo/utils/lib/signatureUtils";
import { kit } from "./services";

export async function verifySignature(
  signature: string,
  account: string,
  body: PaymentMessageRequest
) {
  try {
    const accounts = await kit.contracts.getAccounts();
    const dek = await accounts.getDataEncryptionKey(account);

    const typedData = buildTypedPaymentRequest(
      // @ts-ignore
      { method: body.method, params: body.params },
      await kit.web3.eth.getChainId()
    );

    return verifyEIP712TypedDataSigner(
      typedData,
      signature,
      AddressUtils.publicKeyToAddress(dek)
    );
  } catch (e) {
    console.log(e);
    return false;
  }
}
