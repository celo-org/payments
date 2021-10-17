import test from "ava";

import { buildTypedPaymentRequest } from ".";
import {
  AbortCodes,
  AbortRequest,
  EIP712Parameter,
  EIP712Schemas,
  EIP712Types,
  GetPaymentInfoRequest,
  InitChargeRequest,
} from "@celo/payments-types";

function compareEip712Parameter(a: EIP712Parameter, b: EIP712Parameter) {
  return a.name.localeCompare(b.name);
}

function deepEqualTypedData(t, typedData, expectedTypedData) {
  Object.entries(typedData).forEach(([key, value]) => {
    if (key === "types") {
      Object.entries(value as EIP712Types).forEach(([typeKey, typeValue]) => {
        t.deepEqual(
          typeValue.sort(compareEip712Parameter),
          expectedTypedData.types[typeKey].sort(compareEip712Parameter)
        );
      });
    } else {
      t.deepEqual(value, expectedTypedData[key]);
    }
  });
}

test("Use buildTypedPaymentRequest With full flat command", (t) => {
  const message = {
    method: GetPaymentInfoRequest.method.value,
    params: {
      referenceId: "1234",
    },
  };

  const expectedTypedData = {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
      ],
      Request: [
        { name: "method", type: "string" },
        { name: "params", type: "GetPaymentInfoParams" },
      ],
      GetPaymentInfoParams: [{ name: "referenceId", type: "string" }],
    },
    primaryType: "Request",
    domain: {
      name: "Celo Payments",
      version: "1",
      chainId: 2,
    },
    message,
  };

  const typedData = buildTypedPaymentRequest(
    message,
    EIP712Schemas.GetPaymentInfoRequest.schema,
    2
  );

  deepEqualTypedData(t, typedData, expectedTypedData);
});

test("Use buildTypedPaymentRequest With partial flat command", (t) => {
  const message = {
    method: AbortRequest.method.value,
    params: {
      referenceId: "1234",
      abortCode: AbortCodes.GENERAL,
      // abortMessage is optional
    },
  };

  const expectedTypedData = {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
      ],
      Request: [
        { name: "method", type: "string" },
        { name: "params", type: "AbortParams" },
      ],
      AbortParams: [
        { name: "referenceId", type: "string" },
        { name: "abortCode", type: "string" },
      ],
    },
    primaryType: "Request",
    domain: {
      name: "Celo Payments",
      version: "1",
      chainId: 2,
    },
    message,
  };

  const typedData = buildTypedPaymentRequest(
    message,
    EIP712Schemas.AbortRequest.schema,
    2
  );

  deepEqualTypedData(t, typedData, expectedTypedData);
});

test("Use buildTypedPaymentRequest With partial nested command", (t) => {
  const message = {
    method: InitChargeRequest.method.value,
    params: {
      referenceId: "1234",
      sender: {
        accountAddress: "4321dcba",
        payerData: {
          phoneNumber: "0123456789",
        },
      },
      transactionHash: "abcd1234",
    },
  };

  const expectedTypedData = {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
      ],
      Request: [
        { name: "method", type: "string" },
        { name: "params", type: "InitChargeParams" },
      ],
      InitChargeParams: [
        { name: "sender", type: "PaymentSender" },
        { name: "referenceId", type: "string" },
        { name: "transactionHash", type: "string" },
      ],
      PaymentSender: [
        { name: "accountAddress", type: "string" },
        { name: "payerData", type: "PayerData" },
      ],
      PayerData: [{ name: "phoneNumber", type: "string" }],
    },
    primaryType: "Request",
    domain: {
      name: "Celo Payments",
      version: "1",
      chainId: 2,
    },
    message,
  };

  const typedData = buildTypedPaymentRequest(
    message,
    EIP712Schemas.InitChargeRequest.schema,
    2
  );

  deepEqualTypedData(t, typedData, expectedTypedData);
});
