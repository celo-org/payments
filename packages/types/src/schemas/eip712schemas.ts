// Temporary solution (definitions aren't exposed yet) - copy definitions from @celo/utils/lib/sign-typed-data-utils
export interface EIP712Parameter {
  name: string;
  type: string;
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

export const EIP712Schemas: EIP712Types = {
  Abort: [
    { name: "id", type: "int256" },
    { name: "jsonrpc", type: "string" },
    { name: "method", type: "string" },
    { name: "params", type: "AbortParams" },
  ],
  AbortParams: [
    { name: "referenceId", type: "string" },
    { name: "abortCode", type: "string" },
    { name: "abortMessage", type: "string" },
  ],
  AbortRequest: [
    { name: "method", type: "string" },
    { name: "params", type: "AbortParams" },
  ],
  AbortResponse: [
    { name: "id", type: "int256" },
    { name: "jsonrpc", type: "string" },
  ],
  Address: [
    { name: "city", type: "string" },
    { name: "country", type: "string" },
    { name: "line1", type: "string" },
    { name: "line2", type: "string" },
    { name: "postalCode", type: "string" },
    { name: "state", type: "string" },
  ],
  Any: [],
  BusinessData: [
    { name: "name", type: "string" },
    { name: "legalName", type: "string" },
    { name: "imageUrl", type: "string" },
    { name: "address", type: "Address" },
  ],
  GetPaymentInfo: [
    { name: "id", type: "int256" },
    { name: "jsonrpc", type: "string" },
    { name: "method", type: "string" },
    { name: "params", type: "GetPaymentInfoParams" },
  ],
  GetPaymentInfoParams: [{ name: "referenceId", type: "string" }],
  GetPaymentInfoRequest: [
    { name: "method", type: "string" },
    { name: "params", type: "GetPaymentInfoParams" },
  ],
  GetPaymentInfoResponse: [
    { name: "id", type: "int256" },
    { name: "jsonrpc", type: "string" },
    { name: "result", type: "PaymentInfo" },
  ],
  InitCharge: [
    { name: "id", type: "int256" },
    { name: "jsonrpc", type: "string" },
    { name: "method", type: "string" },
    { name: "params", type: "InitChargeParams" },
  ],
  InitChargeParams: [
    { name: "sender", type: "PaymentSender" },
    { name: "referenceId", type: "string" },
    { name: "transactionHash", type: "string" },
  ],
  InitChargeRequest: [
    { name: "method", type: "string" },
    { name: "params", type: "InitChargeParams" },
  ],
  InitChargeResponse: [
    { name: "id", type: "int256" },
    { name: "jsonrpc", type: "string" },
  ],
  JsonRpcError: [
    { name: "code", type: "int256" },
    { name: "message", type: "string" },
  ],
  JsonRpcErrorResponse: [
    { name: "id", type: "int256" },
    { name: "jsonrpc", type: "string" },
    { name: "error", type: "JsonRpcError" },
  ],
  JsonRpcInvalidCommandTypeError: [
    { name: "code", type: "int256" },
    { name: "message", type: "string" },
  ],
  JsonRpcInvalidParameterError: [
    { name: "code", type: "int256" },
    { name: "message", type: "string" },
  ],
  JsonRpcInvalidSignatureError: [
    { name: "code", type: "int256" },
    { name: "message", type: "string" },
  ],
  JsonRpcMethodNotFoundError: [
    { name: "code", type: "int256" },
    { name: "message", type: "string" },
  ],
  JsonRpcMissingInformationError: [
    { name: "code", type: "int256" },
    { name: "message", type: "string" },
  ],
  JsonRpcPaymentTypeMismatchError: [
    { name: "code", type: "int256" },
    { name: "message", type: "string" },
  ],
  JsonRpcProtocol: [
    { name: "id", type: "int256" },
    { name: "jsonrpc", type: "string" },
  ],
  JsonRpcReferenceIdNotFoundError: [
    { name: "code", type: "int256" },
    { name: "message", type: "string" },
  ],
  JsonRpcRequired: [
    { name: "id", type: "int256" },
    { name: "jsonrpc", type: "string" },
    { name: "method", type: "string" },
  ],
  JsonRpcRiskChecksFailedError: [
    { name: "code", type: "int256" },
    { name: "message", type: "string" },
  ],
  JsonRpcUnspecifiedError: [
    { name: "code", type: "int256" },
    { name: "message", type: "string" },
  ],
  NationalIdData: [
    { name: "idValue", type: "string" },
    { name: "country", type: "string" },
    { name: "type", type: "string" },
  ],
  PayerData: [
    { name: "givenName", type: "string" },
    { name: "surname", type: "string" },
    { name: "phoneNumber", type: "string" },
    { name: "address", type: "Address" },
    { name: "nationalIdData", type: "NationalIdData" },
  ],
  PaymentAction: [
    { name: "amount", type: "uint256" },
    { name: "currency", type: "string" },
    { name: "action", type: "string" },
    { name: "timestamp", type: "int256" },
  ],
  PaymentInfo: [
    { name: "requiredPayerData", type: "RequiredPayerData" },
    { name: "receiver", type: "ReceiverData" },
    { name: "action", type: "PaymentAction" },
    { name: "referenceId", type: "string" },
    { name: "description", type: "string" },
  ],
  PaymentSender: [
    { name: "accountAddress", type: "string" },
    { name: "payerData", type: "PayerData" },
  ],
  ReadyForSettlement: [
    { name: "id", type: "int256" },
    { name: "jsonrpc", type: "string" },
    { name: "method", type: "string" },
    { name: "params", type: "ReadyForSettlementParams" },
  ],
  ReadyForSettlementParams: [{ name: "referenceId", type: "string" }],
  ReadyForSettlementRequest: [
    { name: "method", type: "string" },
    { name: "params", type: "ReadyForSettlementParams" },
  ],
  ReadyForSettlementResponse: [
    { name: "id", type: "int256" },
    { name: "jsonrpc", type: "string" },
  ],
  ReceiverData: [
    { name: "accountAddress", type: "string" },
    { name: "businessData", type: "BusinessData" },
  ],
  RequiredAddressData: [
    { name: "city", type: "bool" },
    { name: "country", type: "bool" },
    { name: "line1", type: "bool" },
    { name: "line2", type: "bool" },
    { name: "postalCode", type: "bool" },
    { name: "state", type: "bool" },
  ],
  RequiredNationalIdData: [
    { name: "idValue", type: "bool" },
    { name: "country", type: "bool" },
    { name: "type", type: "bool" },
  ],
  RequiredPayerData: [
    { name: "givenName", type: "bool" },
    { name: "surname", type: "bool" },
    { name: "phoneNumber", type: "bool" },
    { name: "address", type: "RequiredAddressData" },
    { name: "nationalIdData", type: "RequiredNationalIdData" },
  ],
};
