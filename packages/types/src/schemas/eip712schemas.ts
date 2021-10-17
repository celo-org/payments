// Temporary solution (definitions aren't exposed yet) - copy definitions from @celo/utils/lib/sign-typed-data-utils
export interface EIP712Parameter {
  name: string;
  type: string;
}
export interface EIP712TypeDefinition {
  name: string;
  schema: EIP712Parameter[];
}
export interface EIP712TypeDefinitions {
  [key: string]: EIP712TypeDefinition;
}
export interface EIP712Types {
  [key: string]: EIP712Parameter[];
}
export type EIP712ObjectValue = string | number | EIP712Object;
export interface EIP712Object {
  [key: string]: EIP712ObjectValue;
}
export interface EIP712TypedData {
  types: EIP712Types;
  domain: EIP712Object;
  message: EIP712Object;
  primaryType: string;
}

export const EIP712Schemas: EIP712TypeDefinitions = {
  Abort: {
    name: "Abort",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "method", type: "string" },
      { name: "params", type: "AbortParams" },
    ],
  },
  AbortParams: {
    name: "AbortParams",
    schema: [
      { name: "referenceId", type: "string" },
      { name: "abortCode", type: "string" },
      { name: "abortMessage", type: "string" },
    ],
  },
  AbortRequest: {
    name: "AbortRequest",
    schema: [
      { name: "method", type: "string" },
      { name: "params", type: "AbortParams" },
    ],
  },
  AbortResponse: {
    name: "AbortResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
    ],
  },
  Address: {
    name: "Address",
    schema: [
      { name: "city", type: "string" },
      { name: "country", type: "string" },
      { name: "line1", type: "string" },
      { name: "line2", type: "string" },
      { name: "postalCode", type: "string" },
      { name: "state", type: "string" },
    ],
  },
  Any: { name: "Any", schema: [] },
  BusinessData: {
    name: "BusinessData",
    schema: [
      { name: "name", type: "string" },
      { name: "legalName", type: "string" },
      { name: "imageUrl", type: "string" },
      { name: "address", type: "Address" },
    ],
  },
  GetPaymentInfo: {
    name: "GetPaymentInfo",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "method", type: "string" },
      { name: "params", type: "GetPaymentInfoParams" },
    ],
  },
  GetPaymentInfoParams: {
    name: "GetPaymentInfoParams",
    schema: [{ name: "referenceId", type: "string" }],
  },
  GetPaymentInfoRequest: {
    name: "GetPaymentInfoRequest",
    schema: [
      { name: "method", type: "string" },
      { name: "params", type: "GetPaymentInfoParams" },
    ],
  },
  GetPaymentInfoResponse: {
    name: "GetPaymentInfoResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "result", type: "PaymentInfo" },
    ],
  },
  InitCharge: {
    name: "InitCharge",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "method", type: "string" },
      { name: "params", type: "InitChargeParams" },
    ],
  },
  InitChargeParams: {
    name: "InitChargeParams",
    schema: [
      { name: "sender", type: "PaymentSender" },
      { name: "referenceId", type: "string" },
      { name: "transactionHash", type: "string" },
    ],
  },
  InitChargeRequest: {
    name: "InitChargeRequest",
    schema: [
      { name: "method", type: "string" },
      { name: "params", type: "InitChargeParams" },
    ],
  },
  InitChargeResponse: {
    name: "InitChargeResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
    ],
  },
  JsonRpcError: {
    name: "JsonRpcError",
    schema: [
      { name: "code", type: "int256" },
      { name: "message", type: "string" },
    ],
  },
  JsonRpcErrorResponse: {
    name: "JsonRpcErrorResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "error", type: "JsonRpcError" },
    ],
  },
  JsonRpcInvalidCommandTypeError: {
    name: "JsonRpcInvalidCommandTypeError",
    schema: [
      { name: "code", type: "int256" },
      { name: "message", type: "string" },
    ],
  },
  JsonRpcInvalidParameterError: {
    name: "JsonRpcInvalidParameterError",
    schema: [
      { name: "code", type: "int256" },
      { name: "message", type: "string" },
    ],
  },
  JsonRpcInvalidSignatureError: {
    name: "JsonRpcInvalidSignatureError",
    schema: [
      { name: "code", type: "int256" },
      { name: "message", type: "string" },
    ],
  },
  JsonRpcMethodNotFoundError: {
    name: "JsonRpcMethodNotFoundError",
    schema: [
      { name: "code", type: "int256" },
      { name: "message", type: "string" },
    ],
  },
  JsonRpcMissingInformationError: {
    name: "JsonRpcMissingInformationError",
    schema: [
      { name: "code", type: "int256" },
      { name: "message", type: "string" },
    ],
  },
  JsonRpcPaymentTypeMismatchError: {
    name: "JsonRpcPaymentTypeMismatchError",
    schema: [
      { name: "code", type: "int256" },
      { name: "message", type: "string" },
    ],
  },
  JsonRpcProtocol: {
    name: "JsonRpcProtocol",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
    ],
  },
  JsonRpcReferenceIdNotFoundError: {
    name: "JsonRpcReferenceIdNotFoundError",
    schema: [
      { name: "code", type: "int256" },
      { name: "message", type: "string" },
    ],
  },
  JsonRpcRequired: {
    name: "JsonRpcRequired",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "method", type: "string" },
    ],
  },
  JsonRpcRiskChecksFailedError: {
    name: "JsonRpcRiskChecksFailedError",
    schema: [
      { name: "code", type: "int256" },
      { name: "message", type: "string" },
    ],
  },
  JsonRpcUnspecifiedError: {
    name: "JsonRpcUnspecifiedError",
    schema: [
      { name: "code", type: "int256" },
      { name: "message", type: "string" },
    ],
  },
  NationalIdData: {
    name: "NationalIdData",
    schema: [
      { name: "idValue", type: "string" },
      { name: "country", type: "string" },
      { name: "type", type: "string" },
    ],
  },
  PayerData: {
    name: "PayerData",
    schema: [
      { name: "givenName", type: "string" },
      { name: "surname", type: "string" },
      { name: "phoneNumber", type: "string" },
      { name: "address", type: "Address" },
      { name: "nationalIdData", type: "NationalIdData" },
    ],
  },
  PaymentAction: {
    name: "PaymentAction",
    schema: [
      { name: "amount", type: "uint256" },
      { name: "currency", type: "string" },
      { name: "action", type: "string" },
      { name: "timestamp", type: "int256" },
    ],
  },
  PaymentInfo: {
    name: "PaymentInfo",
    schema: [
      { name: "requiredPayerData", type: "RequiredPayerData" },
      { name: "receiver", type: "ReceiverData" },
      { name: "action", type: "PaymentAction" },
      { name: "referenceId", type: "string" },
      { name: "description", type: "string" },
    ],
  },
  PaymentSender: {
    name: "PaymentSender",
    schema: [
      { name: "accountAddress", type: "string" },
      { name: "payerData", type: "PayerData" },
    ],
  },
  ReadyForSettlement: {
    name: "ReadyForSettlement",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "method", type: "string" },
      { name: "params", type: "ReadyForSettlementParams" },
    ],
  },
  ReadyForSettlementParams: {
    name: "ReadyForSettlementParams",
    schema: [{ name: "referenceId", type: "string" }],
  },
  ReadyForSettlementRequest: {
    name: "ReadyForSettlementRequest",
    schema: [
      { name: "method", type: "string" },
      { name: "params", type: "ReadyForSettlementParams" },
    ],
  },
  ReadyForSettlementResponse: {
    name: "ReadyForSettlementResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
    ],
  },
  ReceiverData: {
    name: "ReceiverData",
    schema: [
      { name: "accountAddress", type: "string" },
      { name: "businessData", type: "BusinessData" },
    ],
  },
  RequiredAddressData: {
    name: "RequiredAddressData",
    schema: [
      { name: "city", type: "bool" },
      { name: "country", type: "bool" },
      { name: "line1", type: "bool" },
      { name: "line2", type: "bool" },
      { name: "postalCode", type: "bool" },
      { name: "state", type: "bool" },
    ],
  },
  RequiredNationalIdData: {
    name: "RequiredNationalIdData",
    schema: [
      { name: "idValue", type: "bool" },
      { name: "country", type: "bool" },
      { name: "type", type: "bool" },
    ],
  },
  RequiredPayerData: {
    name: "RequiredPayerData",
    schema: [
      { name: "givenName", type: "bool" },
      { name: "surname", type: "bool" },
      { name: "phoneNumber", type: "bool" },
      { name: "address", type: "RequiredAddressData" },
      { name: "nationalIdData", type: "RequiredNationalIdData" },
    ],
  },
};
