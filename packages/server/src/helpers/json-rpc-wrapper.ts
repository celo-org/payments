import { ResponseToolkit } from "@hapi/hapi";
import {
  EIP712Schemas,
  EIP712TypeDefinition,
  JsonRpcError,
  JsonRpcInvalidSignatureError,
  JsonRpcMethodNotFoundError,
  JsonRpcProtocol,
  JsonRpcReferenceIdNotFoundError,
  OffchainHeaders,
} from "@celo/payments-types";
import { buildTypedPaymentRequest } from "@celo/payments-utils";
import { ChainHandler } from "@celo/payments-sdk";

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

async function offchainSign(
  message: JSON,
  eip712TypeDefinition: EIP712TypeDefinition,
  chainHandler: ChainHandler,
  apiResponse: ResponseToolkit
) {
  const typedData = buildTypedPaymentRequest(
    message,
    eip712TypeDefinition.schema,
    await chainHandler.getChainId()
  );

  const signature = await chainHandler.signTypedPaymentRequest(typedData);
  const response = apiResponse.response(message);
  response.header(OffchainHeaders.SIGNATURE, signature);
  response.header(OffchainHeaders.ADDRESS, chainHandler.getSendingAddress());
  return response;
}

export async function jsonRpcSuccess(
  apiResponse: ResponseToolkit,
  jsonRpcRequestId: number,
  chainHandler: ChainHandler,
  schema: EIP712TypeDefinition,
  result?: JSON
) {
  const wrappedResult = wrapWithJsonRpc(jsonRpcRequestId, result);
  const response = await offchainSign(
    wrappedResult,
    schema,
    chainHandler,
    apiResponse
  );
  return response.code(200);
}

export async function jsonRpcError(
  apiResponse: ResponseToolkit,
  jsonRpcRequestId: number,
  chainHandler: ChainHandler,
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
  const response = await offchainSign(
    error,
    EIP712Schemas.JsonRpcErrorResponse,
    chainHandler,
    apiResponse
  );
  return response.code(httpCode);
}

export function methodNotFound(
  apiResponse: ResponseToolkit,
  jsonRpcRequestId: number,
  chainHandler: ChainHandler
) {
  const methodNotFoundError = <JsonRpcMethodNotFoundError>{
    code: JsonRpcMethodNotFoundError.code.value,
    message: "JSON-RPC method not found",
  };
  return jsonRpcError(
    apiResponse,
    jsonRpcRequestId,
    chainHandler,
    methodNotFoundError
  );
}

export function paymentNotFound(
  apiResponse: ResponseToolkit,
  jsonRpcRequestId: number,
  chainHandler: ChainHandler,
  referenceId?: string
) {
  const paymentNotFoundError = <JsonRpcReferenceIdNotFoundError>{
    code: JsonRpcReferenceIdNotFoundError.code.value,
    message: "Reference id not found",
    data: {
      referenceId,
    },
  };
  return jsonRpcError(
    apiResponse,
    jsonRpcRequestId,
    chainHandler,
    paymentNotFoundError
  );
}

export function unauthenticatedRequest(
  apiResponse: ResponseToolkit,
  jsonRpcRequestId: number,
  chainHandler: ChainHandler
) {
  const invalidSignatureError = <JsonRpcInvalidSignatureError>{
    code: JsonRpcInvalidSignatureError.code.value,
    message: "Invalid signature",
  };
  return jsonRpcError(
    apiResponse,
    jsonRpcRequestId,
    chainHandler,
    invalidSignatureError
  );
}
