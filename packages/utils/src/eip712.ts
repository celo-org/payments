import {
  EIP712ObjectValue,
  EIP712Parameter,
  EIP712Schemas,
  EIP712TypedData,
  EIP712Types,
  PaymentMessageRequest,
} from "@celo/payments-types";

// import * as util from "util";

function scanTypedSchema(
  message: EIP712ObjectValue,
  schema: EIP712Parameter[],
  schemasBag: EIP712Types,
  schemaBagName: string
) {
  Object.entries(message).forEach(([propName, value]) => {
    const parameter = schema.find(({ name }) => name === propName);
    if (!parameter) {
      throw new Error(
        `Unknown EIP712 type of parameter ${parameter}, for message value ${propName}: ${value}`
      );
    }

    if (!schemasBag[schemaBagName]) {
      schemasBag[schemaBagName] = [];
    }
    schemasBag[schemaBagName].push(parameter);

    if (["string", "number"].includes(parameter.type)) {
      return;
    }

    const type = EIP712Schemas[parameter.type];
    if (!type) {
      throw new Error(`Unknown EIP712 type of parameter ${parameter}`);
    }

    scanTypedSchema(value, type, schemasBag, parameter.type);
  });
}

export function buildTypedPaymentRequest(
  message: PaymentMessageRequest,
  schema: EIP712Parameter[],
  chainId: number
): EIP712TypedData {
  const schemaBag: EIP712Types = {};
  scanTypedSchema(message, schema, schemaBag, "Request");

  const typedData = {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
      ],
      ...schemaBag,
    },
    primaryType: "Request",
    domain: {
      name: "Celo Payments",
      version: "1",
      chainId,
    },
    message,
  };

  // console.log(util.inspect(typedData, false, null, true /* enable colors */));

  return typedData;
}
