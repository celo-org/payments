import { ResponseToolkit } from "@hapi/hapi";
import { has } from "../storage";
import { AbortParams, EIP712Schemas } from "@celo/payments-types";
import { jsonRpcSuccess, paymentNotFound } from "../helpers/json-rpc-wrapper";
import { ChainHandler } from "@celo/payments-sdk";

export function abort(
  jsonRpcRequestId: number,
  params: AbortParams,
  chainHandler: ChainHandler,
  res: ResponseToolkit
) {
  if (!has(params.referenceId)) {
    return paymentNotFound(
      res,
      jsonRpcRequestId,
      chainHandler,
      params.referenceId
    );
  }

  console.log("abort", params);

  return jsonRpcSuccess(
    res,
    jsonRpcRequestId,
    chainHandler,
    EIP712Schemas.AbortResponse
  );
}
