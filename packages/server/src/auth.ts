import {
  EIP712Schemas,
  GetPaymentInfoRequest,
  InitChargeRequest,
  PaymentMessageRequest,
  ReadyForSettlementRequest,
} from "@celo/payments-types";
import { buildTypedPaymentRequest } from "@celo/payments-utils";
import { AddressUtils } from "@celo/utils";
import { verifyEIP712TypedDataSigner } from "@celo/utils/lib/signatureUtils";
import Ajv from "ajv";
import { OffchainJsonSchema } from "@celo/payments-types";

import { kit } from "./services";

const ajv = new Ajv({ strictSchema: false, validateFormats: false });
ajv.addSchema(OffchainJsonSchema, "OffchainJsonSchema");

export async function verifySignature(
  signature: string,
  account: string,
  body: PaymentMessageRequest
) {
  try {
    console.log("Sending address", account);
    const accounts = await kit.contracts.getAccounts();
    const dek = await accounts.getDataEncryptionKey(account);
    console.log("Sending address DEK", dek);

    let schema, schemaKey;
    switch (body.method) {
      case GetPaymentInfoRequest.method.value:
        schema = EIP712Schemas.GetPaymentInfoRequest;
        schemaKey = "GetPaymentInfoParams";
        break;
      case InitChargeRequest.method.value:
        schema = EIP712Schemas.InitChargeRequest;
        schemaKey = "InitChargeParams";
        break;
      case ReadyForSettlementRequest.method.value:
        schema = EIP712Schemas.ReadyForSettlementRequest;
        schemaKey = "ReadyForSettlementParams";
        break;
    }

    const typedData = buildTypedPaymentRequest(
      { method: body.method, params: body.params } as PaymentMessageRequest,
      schema,
      await kit.web3.eth.getChainId()
    );

    if (
      !ajv.validate(
        { $ref: `OffchainJsonSchema#/components/schemas/${schemaKey}` },
        body.params
      )
    ) {
      console.log("json schema validation failed");
      return false;
    }

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
