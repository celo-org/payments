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
import { UnknownMethodError } from '../errors/unknown-method';
import { ChainHandlerForAuthentication } from '../handlers';

const ajv = new Ajv({ strictSchema: false, validateFormats: false });
ajv.addSchema(OffchainJsonSchema, 'OffchainJsonSchema');

export interface AuthenticationHeaders {
  [OffchainHeaders.SIGNATURE]: string;
  [OffchainHeaders.ADDRESS]: string;
}

export async function verifySignature(
  chainHandler: ChainHandlerForAuthentication,
  authorizationHeaders: AuthenticationHeaders,
  body: PaymentMessageRequest | PaymentMessageResponse,
  typeDefinition: EIP712TypeDefinition
): Promise<[boolean, ErrorObject[]]> {
  const signature =
    authorizationHeaders[OffchainHeaders.SIGNATURE.toLowerCase()];
  const account = authorizationHeaders[OffchainHeaders.ADDRESS.toLowerCase()];

  try {
    const [isSchemaValid, schemaErrors] = validateSchema(body, typeDefinition);
    if (!isSchemaValid) {
      return [false, schemaErrors];
    }

    const dek = await chainHandler.getDataEncryptionKey(account);

    const typedData = buildTypedPaymentRequest(
      body,
      typeDefinition.schema,
      await chainHandler.getChainId()
    );

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
  chainHandler: ChainHandlerForAuthentication,
  authorizationHeaders: AuthenticationHeaders,
  body: PaymentMessageRequest
): Promise<[boolean, ErrorObject[]]> {
  const method = body.method.toString();

  const typeDefinition = getTypeDefinitionByMethod(method);

  return verifySignature(
    chainHandler,
    authorizationHeaders,
    body,
    typeDefinition
  );
}

export function validateSchema(
  body: PaymentMessageRequest | PaymentMessageResponse,
  typeDefinition: EIP712TypeDefinition
): [boolean, ErrorObject[]] {
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
  return [true, []];
}

export async function validateRequestSchema(body: PaymentMessageRequest) {
  const method = body.method.toString();
  const typeDefinition = getTypeDefinitionByMethod(method);
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
  return [true, []];
}

function getTypeDefinitionByMethod(method: string) {
  for (const [methodName, typeDef] of Object.entries(KNOWN_METHODS)) {
    if (method === methodName) return typeDef;
  }

  throw new UnknownMethodError(method, Object.keys(KNOWN_METHODS));
}

const KNOWN_METHODS = {
  [GetPaymentInfoRequest.method.value]: EIP712Schemas.GetPaymentInfo,
  [InitChargeRequest.method.value]: EIP712Schemas.InitCharge,
  [ReadyForSettlementRequest.method.value]: EIP712Schemas.ReadyForSettlement,
  [AbortRequest.method.value]: EIP712Schemas.Abort,
};
