import { ResponseToolkit } from "@hapi/hapi";
import { has } from "../storage";
import { AbortParams } from "@celo/payments-types";
import { jsonRpcSuccess, paymentNotFound } from "../helpers/json-rpc-wrapper";

export function abort(
  jsonRpcRequestId: number,
  params: AbortParams,
  res: ResponseToolkit
) {
  if (!has(params.referenceId)) {
    return paymentNotFound(res, jsonRpcRequestId, params.referenceId);
  }

  console.log("abort", params);

  return jsonRpcSuccess(res, jsonRpcRequestId);
}
