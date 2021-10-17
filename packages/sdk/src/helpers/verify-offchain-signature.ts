import {
  EIP712TypeDefinition,
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
  typeDefinition: EIP712TypeDefinition
): Promise<[boolean, ErrorObject[]]> {
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
