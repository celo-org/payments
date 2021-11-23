import {
  EIP712ObjectValue,
  EIP712Parameter,
  EIP712Schemas,
  EIP712Types,
  EIP712TypedData,
} from "@celo/payments-types";
import { sortTypedData } from "./sort-functions";

function scanTypedSchema(
  message: EIP712ObjectValue,
  schema: EIP712Parameter[],
  schemasBag: EIP712Types,
  schemaBagName: string
) {
  Object.entries(message).forEach(([propName, value]) => {
    // not allowed in JSON anyway...
    if (value === undefined) {
      return;
    }
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

    if (["string", "uint256", "int256", "bool", "null"].includes(parameter.type)) {
      return;
    }

    const type = EIP712Schemas[parameter.type].schema;
    if (!type) {
      throw new Error(
        `Unknown EIP712 type of parameter ${JSON.stringify(parameter)}`
      );
    }

    scanTypedSchema(value, type, schemasBag, parameter.type);
  });
}

export function buildTypedPaymentRequest(
  message: any,
  schema: EIP712Parameter[],
  chainId: number
): EIP712TypedData {
  let schemaBag: EIP712Types = {};
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

  return sortTypedData(typedData);
}
