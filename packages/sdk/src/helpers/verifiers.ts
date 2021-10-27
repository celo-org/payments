import {
  AbortRequest,
  EIP712Schemas,
  EIP712TypeDefinition,
  GetPaymentInfoRequest,
  InitChargeRequest,
  OffchainHeaders,
  OffchainJsonSchema,
  PaymentMessageRequest,
  PaymentMessageResponse,
  ReadyForSettlementRequest,
} from '@celo/payments-types';
import { buildTypedPaymentRequest } from '@celo/payments-utils';
import { AddressUtils } from '@celo/utils';
import { verifyEIP712TypedDataSigner } from '@celo/utils/lib/signatureUtils';
import Ajv, { ErrorObject } from 'ajv';
import { ChainHandler } from '../handlers';

const ajv = new Ajv({ strictSchema: false, validateFormats: false });
ajv.addSchema(OffchainJsonSchema, 'OffchainJsonSchema');

export interface AuthenticationHeaders {
  [OffchainHeaders.SIGNATURE]: string;
  [OffchainHeaders.ADDRESS]: string;
}

export async function verifySignature(
  chainHandler: ChainHandler,
  authorizationHeaders: AuthenticationHeaders,
  body: PaymentMessageRequest | PaymentMessageResponse,
  typeDefinition: EIP712TypeDefinition
): Promise<[boolean, ErrorObject[]]> {
  const signature =
    authorizationHeaders[OffchainHeaders.SIGNATURE.toLowerCase()];
  const account = authorizationHeaders[OffchainHeaders.ADDRESS.toLowerCase()];

  try {
    const dek = await chainHandler.getDataEncryptionKey(account);

    const typedData = buildTypedPaymentRequest(
      body,
      typeDefinition.schema,
      await chainHandler.getChainId()
    );

    if (
      !ajv.validate(
        {
          $ref: `OffchainJsonSchema#/components/schemas/${typeDefinition.name}`,
        },
        body
      )
    ) {
      return [false, ajv.errors];
    }

    const verified = verifyEIP712TypedDataSigner(
      typedData,
      signature,
      AddressUtils.publicKeyToAddress(dek)
    );

    return [verified, []];
  } catch (e) {
    return [false, [e.message]];
  }
}

export async function verifyRequestSignature(
  chainHandler: ChainHandler,
  authorizationHeaders: AuthenticationHeaders,
  body: PaymentMessageRequest
): Promise<[boolean, ErrorObject[]]> {
  const method = body.method.toString();

  let typeDefinition;

  switch (method) {
    case GetPaymentInfoRequest.method.value:
      typeDefinition = EIP712Schemas.GetPaymentInfo;
      break;
    case InitChargeRequest.method.value:
      typeDefinition = EIP712Schemas.InitCharge;
      break;
    case ReadyForSettlementRequest.method.value:
      typeDefinition = EIP712Schemas.ReadyForSettlement;
      break;
    case AbortRequest.method.value:
      typeDefinition = EIP712Schemas.Abort;
      break;
  }

  return verifySignature(
    chainHandler,
    authorizationHeaders,
    body,
    typeDefinition
  );
}
