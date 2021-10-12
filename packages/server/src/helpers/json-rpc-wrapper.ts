import { ResponseToolkit } from "@hapi/hapi";
import {
  JsonRpcError,
  JsonRpcInvalidSignatureError,
  JsonRpcMethodNotFoundError,
  JsonRpcProtocol,
  JsonRpcReferenceIdNotFoundError,
} from "@celo/payments-types";

export type JSON = Record<string, any>;
export type JsonRpcResponse = JsonRpcProtocol & {
  result?: JSON;
  error?: JsonRpcError;
};

export function wrapWithJsonRpc(
  jsonRpcRequestId: number,
  result?: JSON,
  error?: JsonRpcError
) {
  let response = <JsonRpcResponse>{
    jsonrpc: "2.0",
    id: jsonRpcRequestId,
  };
  if (result) {
    response = { ...response, result };
  } else if (error) {
    response = { ...response, error };
  }
  return response;
}

export function jsonRpcSuccess(
  apiResponse: ResponseToolkit,
  jsonRpcRequestId: number,
  result?: JSON
) {
  return apiResponse
    .response(wrapWithJsonRpc(jsonRpcRequestId, result))
    .code(200);
}

export function jsonRpcError(
  apiResponse: ResponseToolkit,
  jsonRpcRequestId: number,
  jsonRpcError: JsonRpcError
) {
  let httpCode = 500;
  switch (jsonRpcError.code) {
    case JsonRpcReferenceIdNotFoundError.code.value:
      httpCode = 404;
      break;
    case JsonRpcInvalidSignatureError.code.value:
    case JsonRpcMethodNotFoundError.code.value:
      httpCode = 400;
      break;
  }
  const error = wrapWithJsonRpc(jsonRpcRequestId, undefined, jsonRpcError);
  return apiResponse.response(error).code(httpCode);
}

export function methodNotFound(
  apiResponse: ResponseToolkit,
  jsonRpcRequestId: number
) {
  const methodNotFoundError = <JsonRpcMethodNotFoundError>{
    code: JsonRpcMethodNotFoundError.code.value,
    message: "JSON-RPC method not found",
  };
  return jsonRpcError(apiResponse, jsonRpcRequestId, methodNotFoundError);
}

export function paymentNotFound(
  apiResponse: ResponseToolkit,
  jsonRpcRequestId: number,
  referenceId?: string
) {
  const paymentNotFoundError = <JsonRpcReferenceIdNotFoundError>{
    code: JsonRpcReferenceIdNotFoundError.code.value,
    message: "Reference id not found",
    data: {
      referenceId,
    },
  };
  return jsonRpcError(apiResponse, jsonRpcRequestId, paymentNotFoundError);
}

export function unauthenticatedRequest(
  apiResponse: ResponseToolkit,
  jsonRpcRequestId: number
) {
  const invalidSignatureError = <JsonRpcInvalidSignatureError>{
    code: JsonRpcInvalidSignatureError.code.value,
    message: "Invalid signature",
  };
  return jsonRpcError(apiResponse, jsonRpcRequestId, invalidSignatureError);
}
