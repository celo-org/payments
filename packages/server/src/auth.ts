import { buildTypedPaymentRequest } from "@celo/payments-utils";
import { verifyEIP712TypedDataSigner } from "@celo/utils/lib/signatureUtils";
import { AddressUtils } from "@celo/utils";
import { kit } from "./services";
import { PaymentMessageRequest } from "@celo/payments-types";

import { generateTypedDataHash } from "@celo/utils/lib/sign-typed-data-utils";

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

    console.log(JSON.stringify(typedData));
    console.log(generateTypedDataHash(typedData).toString("hex"));

    const valid = verifyEIP712TypedDataSigner(
      typedData,
      signature,
      AddressUtils.publicKeyToAddress(dek)
    );
    console.log({ valid, expected: AddressUtils.publicKeyToAddress(dek) });
    return valid;
  } catch (e) {
    console.log(e);
    return false;
  }
}
