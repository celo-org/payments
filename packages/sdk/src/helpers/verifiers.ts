import {
  AbortRequest,
  EIP712Schemas,
  EIP712TypeDefinition,
  GetPaymentInfoRequest,
  InitChargeRequest,
  OffchainHeaders,
  OffchainJsonSchema,
  PaymentMessage,
  PaymentMessageResponse,
  ReadyForSettlementRequest,
} from '@celo/payments-types';
import { buildTypedPaymentRequest } from '@celo/payments-utils';
import { AddressUtils } from '@celo/utils';
import { verifyEIP712TypedDataSigner } from '@celo/utils/lib/signatureUtils';
import Ajv, { ErrorObject } from 'ajv';
import { UnknownMethodError } from '../errors/unknown-method';
import { ChainHandlerForAuthentication } from '../handlers';
import { formats } from './schema-formats';

const ajv = new Ajv({
  strictKeywords: false,
  unknownFormats: 'ignore',
  formats: formats,
});

let schemaLoaded = false;
function loadSchema() {
  if (schemaLoaded) return;
  if (!schemaLoaded) {
    ajv.addSchema(OffchainJsonSchema, 'OffchainJsonSchema');
  }
  schemaLoaded = true;
}

export interface AuthenticationHeaders {
  [OffchainHeaders.SIGNATURE]: string;
  [OffchainHeaders.ADDRESS]: string;
}

function extractHeader(headers: AuthenticationHeaders, headerName: string) {
  if (Object.keys(headers).includes(headerName)) {
    return headers[headerName];
  }

  if (Object.keys(headers).includes(headerName.toLowerCase())) {
    return headers[headerName.toLowerCase()];
  }

  return headers[headerName.toUpperCase()];
}

export async function verifySignature(
  chainHandler: ChainHandlerForAuthentication,
  authorizationHeaders: AuthenticationHeaders,
  body: PaymentMessage | PaymentMessageResponse,
  typeDefinition: EIP712TypeDefinition
): Promise<[boolean, ErrorObject[]]> {
  const signature = extractHeader(
    authorizationHeaders,
    OffchainHeaders.SIGNATURE
  );
  const account = extractHeader(authorizationHeaders, OffchainHeaders.ADDRESS);

  try {
    // const [isSchemaValid, schemaErrors] = validateSchema(body, typeDefinition);
    // if (!isSchemaValid) {
    //   return [false, schemaErrors];
    // }

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
  body: PaymentMessage
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
  body: PaymentMessage | PaymentMessageResponse,
  typeDefinition: EIP712TypeDefinition
): [boolean, ErrorObject[]] {
  loadSchema();
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

export async function validateRequestSchema(body: PaymentMessage) {
  const method = body.method.toString();
  const typeDefinition = getTypeDefinitionByMethod(method);
  loadSchema();
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
