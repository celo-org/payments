import {
  EIP712ObjectValue,
  EIP712Parameter,
  EIP712Schemas,
  EIP712TypedData,
  EIP712Types,
} from "@celo/payments-types";
import {sortTypedData} from "./sort-functions";
import BigNumber from "bignumber.js";

function inspectRawValue(value: EIP712ObjectValue, schemasBag: EIP712Types, schemaBagName: string) {
  Object.entries(value).forEach(([propName, proValue]) => {
    if (typeof proValue === 'string') {
      schemasBag[schemaBagName].push({ name: propName, type: 'string' });
    } else if (typeof proValue === 'number') {
      schemasBag[schemaBagName].push({ name: propName, type: 'int256' });
    } else if (typeof proValue === 'boolean') {
      schemasBag[schemaBagName].push({ name: propName, type: 'bool' });
    } else if (proValue instanceof BigNumber) {
      schemasBag[schemaBagName].push({ name: propName, type: 'int256' });
    } else if (proValue instanceof Buffer) {
      schemasBag[schemaBagName].push({ name: propName, type: 'string' });
    }
      //TS2367: This condition will always return 'false' since the types
      // '"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"'
      // and '"EIP712Object"' have no overlap.
      // else if (typeof proValue === 'EIP712Object') {
      //   schemasBag[schemasBagName].push({ name: propName, type: 'string' });
    // }
    else if (typeof proValue === 'object') {
      const bagName = propName + '_NestedType';
      schemasBag[schemaBagName].push({ name: propName, type: bagName });
      schemasBag[bagName] = [];

      inspectRawValue(proValue, schemasBag, bagName);
    }
  });
}

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

    if (parameter.type === 'Any') {
      return inspectRawValue(value, schemasBag, schemaBagName);
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

  return sortTypedData(typedData);
}
