import {
  EIP712Parameter,
  OffchainJsonSchema,
  PaymentMessageRequest,
  PaymentMessageResponse,
} from '@celo/payments-types';
import { buildTypedPaymentRequest } from '@celo/payments-utils';
import { AddressUtils } from '@celo/utils';
import { verifyEIP712TypedDataSigner } from '@celo/utils/lib/signatureUtils';
import Ajv, { ErrorObject } from 'ajv';
import { ChainHandler } from '../handlers';

const ajv = new Ajv({ strictSchema: false, validateFormats: false });
ajv.addSchema(OffchainJsonSchema, 'OffchainJsonSchema');

export async function verifySignature(
  chainHandler: ChainHandler,
  signature: string,
  account: string,
  body: PaymentMessageRequest | PaymentMessageResponse,
  schema: EIP712Parameter[],
  schemaName: string
): Promise<[boolean, ErrorObject[]]> {
  try {
    const dek = await chainHandler.getDataEncryptionKey(account);

    const typedData = buildTypedPaymentRequest(
      body,
      schema,
      await chainHandler.getChainId()
    );

    if (
      !ajv.validate(
        { $ref: `OffchainJsonSchema#/components/schemas/${schemaName}` },
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
