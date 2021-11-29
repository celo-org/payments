export {
  EIP712ObjectValue,
  EIP712Parameter,
  EIP712TypedData,
  EIP712Types,
} from "@celo/utils/lib/sign-typed-data-utils";

import { EIP712Parameter } from "@celo/utils/lib/sign-typed-data-utils";

// Temporary solution (definitions aren't exposed yet) - copy definitions from @celo/utils/lib/sign-typed-data-utils
export interface EIP712TypeDefinition {
  name: string;
  schema: EIP712Parameter[];
  bigNumbers: string[];
}
export interface EIP712TypeDefinitions {
  [key: string]: EIP712TypeDefinition;
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
    bigNumbers: [],
  },
  AbortParams: {
    name: "AbortParams",
    schema: [
      { name: "referenceId", type: "string" },
      { name: "abortCode", type: "string" },
      { name: "abortMessage", type: "string" },
    ],
    bigNumbers: [],
  },
  AbortRequest: {
    name: "AbortRequest",
    schema: [
      { name: "method", type: "string" },
      { name: "params", type: "AbortParams" },
    ],
    bigNumbers: [],
  },
  AbortResponse: {
    name: "AbortResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "result", type: "string" },
    ],
    bigNumbers: [],
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
    bigNumbers: [],
  },
  Any: { name: "Any", schema: [], bigNumbers: [] },
  BusinessData: {
    name: "BusinessData",
    schema: [
      { name: "name", type: "string" },
      { name: "legalName", type: "string" },
      { name: "imageUrl", type: "string" },
      { name: "address", type: "Address" },
    ],
    bigNumbers: [],
  },
  GetPaymentInfo: {
    name: "GetPaymentInfo",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "method", type: "string" },
      { name: "params", type: "GetPaymentInfoParams" },
    ],
    bigNumbers: [],
  },
  GetPaymentInfoParams: {
    name: "GetPaymentInfoParams",
    schema: [{ name: "referenceId", type: "string" }],
    bigNumbers: [],
  },
  GetPaymentInfoRequest: {
    name: "GetPaymentInfoRequest",
    schema: [
      { name: "method", type: "string" },
      { name: "params", type: "GetPaymentInfoParams" },
    ],
    bigNumbers: [],
  },
  GetPaymentInfoResponse: {
    name: "GetPaymentInfoResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "result", type: "PaymentInfo" },
    ],
    bigNumbers: [],
  },
  InitCharge: {
    name: "InitCharge",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "method", type: "string" },
      { name: "params", type: "InitChargeParams" },
    ],
    bigNumbers: [],
  },
  InitChargeParams: {
    name: "InitChargeParams",
    schema: [
      { name: "sender", type: "PaymentSender" },
      { name: "referenceId", type: "string" },
      { name: "transactionHash", type: "string" },
    ],
    bigNumbers: [],
  },
  InitChargeRequest: {
    name: "InitChargeRequest",
    schema: [
      { name: "method", type: "string" },
      { name: "params", type: "InitChargeParams" },
    ],
    bigNumbers: [],
  },
  InitChargeResponse: {
    name: "InitChargeResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "result", type: "string" },
    ],
    bigNumbers: [],
  },
  JsonRpcError: {
    name: "JsonRpcError",
    schema: [
      { name: "code", type: "int256" },
      { name: "message", type: "string" },
    ],
    bigNumbers: [],
  },
  JsonRpcErrorResponse: {
    name: "JsonRpcErrorResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "error", type: "JsonRpcError" },
    ],
    bigNumbers: [],
  },
  JsonRpcInvalidCommandTypeError: {
    name: "JsonRpcInvalidCommandTypeError",
    schema: [{ name: "code", type: "int256" }],
    bigNumbers: [],
  },
  JsonRpcInvalidCommandTypeErrorResponse: {
    name: "JsonRpcInvalidCommandTypeErrorResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "error", type: "JsonRpcInvalidCommandTypeError" },
    ],
    bigNumbers: [],
  },
  JsonRpcInvalidParameterError: {
    name: "JsonRpcInvalidParameterError",
    schema: [{ name: "code", type: "int256" }],
    bigNumbers: [],
  },
  JsonRpcInvalidParameterErrorResponse: {
    name: "JsonRpcInvalidParameterErrorResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "error", type: "JsonRpcInvalidParameterError" },
    ],
    bigNumbers: [],
  },
  JsonRpcInvalidRequestError: {
    name: "JsonRpcInvalidRequestError",
    schema: [{ name: "code", type: "int256" }],
    bigNumbers: [],
  },
  JsonRpcInvalidRequestErrorResponse: {
    name: "JsonRpcInvalidRequestErrorResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "error", type: "JsonRpcInvalidRequestError" },
    ],
    bigNumbers: [],
  },
  JsonRpcInvalidSignatureError: {
    name: "JsonRpcInvalidSignatureError",
    schema: [{ name: "code", type: "int256" }],
    bigNumbers: [],
  },
  JsonRpcInvalidSignatureErrorResponse: {
    name: "JsonRpcInvalidSignatureErrorResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "error", type: "JsonRpcInvalidSignatureError" },
    ],
    bigNumbers: [],
  },
  JsonRpcMethodNotFoundError: {
    name: "JsonRpcMethodNotFoundError",
    schema: [{ name: "code", type: "int256" }],
    bigNumbers: [],
  },
  JsonRpcMethodNotFoundErrorResponse: {
    name: "JsonRpcMethodNotFoundErrorResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "error", type: "JsonRpcMethodNotFoundError" },
    ],
    bigNumbers: [],
  },
  JsonRpcMissingInformationError: {
    name: "JsonRpcMissingInformationError",
    schema: [{ name: "code", type: "int256" }],
    bigNumbers: [],
  },
  JsonRpcMissingInformationErrorResponse: {
    name: "JsonRpcMissingInformationErrorResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "error", type: "JsonRpcMissingInformationError" },
    ],
    bigNumbers: [],
  },
  JsonRpcPaymentTypeMismatchError: {
    name: "JsonRpcPaymentTypeMismatchError",
    schema: [{ name: "code", type: "int256" }],
    bigNumbers: [],
  },
  JsonRpcPaymentTypeMismatchErrorResponse: {
    name: "JsonRpcPaymentTypeMismatchErrorResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "error", type: "JsonRpcPaymentTypeMismatchError" },
    ],
    bigNumbers: [],
  },
  JsonRpcProtocol: {
    name: "JsonRpcProtocol",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
    ],
    bigNumbers: [],
  },
  JsonRpcReferenceIdNotFoundError: {
    name: "JsonRpcReferenceIdNotFoundError",
    schema: [{ name: "code", type: "int256" }],
    bigNumbers: [],
  },
  JsonRpcReferenceIdNotFoundErrorResponse: {
    name: "JsonRpcReferenceIdNotFoundErrorResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "error", type: "JsonRpcReferenceIdNotFoundError" },
    ],
    bigNumbers: [],
  },
  JsonRpcRequired: {
    name: "JsonRpcRequired",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "method", type: "string" },
    ],
    bigNumbers: [],
  },
  JsonRpcRiskChecksFailedError: {
    name: "JsonRpcRiskChecksFailedError",
    schema: [{ name: "code", type: "int256" }],
    bigNumbers: [],
  },
  JsonRpcRiskChecksFailedErrorResponse: {
    name: "JsonRpcRiskChecksFailedErrorResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "error", type: "JsonRpcRiskChecksFailedError" },
    ],
    bigNumbers: [],
  },
  JsonRpcSuccessResponse: {
    name: "JsonRpcSuccessResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "result", type: "string" },
    ],
    bigNumbers: [],
  },
  JsonRpcUnspecifiedError: {
    name: "JsonRpcUnspecifiedError",
    schema: [{ name: "code", type: "int256" }],
    bigNumbers: [],
  },
  JsonRpcUnspecifiedErrorResponse: {
    name: "JsonRpcUnspecifiedErrorResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "error", type: "JsonRpcUnspecifiedError" },
    ],
    bigNumbers: [],
  },
  NationalIdData: {
    name: "NationalIdData",
    schema: [
      { name: "idValue", type: "string" },
      { name: "country", type: "string" },
      { name: "type", type: "string" },
    ],
    bigNumbers: [],
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
    bigNumbers: [],
  },
  PaymentAction: {
    name: "PaymentAction",
    schema: [
      { name: "amount", type: "uint256" },
      { name: "currency", type: "string" },
      { name: "action", type: "string" },
      { name: "timestamp", type: "int256" },
    ],
    bigNumbers: ["amount"],
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
    bigNumbers: [],
  },
  PaymentSender: {
    name: "PaymentSender",
    schema: [
      { name: "accountAddress", type: "string" },
      { name: "payerData", type: "PayerData" },
    ],
    bigNumbers: [],
  },
  ReadyForSettlement: {
    name: "ReadyForSettlement",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "method", type: "string" },
      { name: "params", type: "ReadyForSettlementParams" },
    ],
    bigNumbers: [],
  },
  ReadyForSettlementParams: {
    name: "ReadyForSettlementParams",
    schema: [{ name: "referenceId", type: "string" }],
    bigNumbers: [],
  },
  ReadyForSettlementRequest: {
    name: "ReadyForSettlementRequest",
    schema: [
      { name: "method", type: "string" },
      { name: "params", type: "ReadyForSettlementParams" },
    ],
    bigNumbers: [],
  },
  ReadyForSettlementResponse: {
    name: "ReadyForSettlementResponse",
    schema: [
      { name: "id", type: "int256" },
      { name: "jsonrpc", type: "string" },
      { name: "result", type: "string" },
    ],
    bigNumbers: [],
  },
  ReceiverData: {
    name: "ReceiverData",
    schema: [
      { name: "accountAddress", type: "string" },
      { name: "businessData", type: "BusinessData" },
    ],
    bigNumbers: [],
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
    bigNumbers: [],
  },
  RequiredNationalIdData: {
    name: "RequiredNationalIdData",
    schema: [
      { name: "idValue", type: "bool" },
      { name: "country", type: "bool" },
      { name: "type", type: "bool" },
    ],
    bigNumbers: [],
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
    bigNumbers: [],
  },
};
