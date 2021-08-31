import { ResponseToolkit } from "@hapi/hapi";
import { get } from "../storage";
import { GetPaymentInfoParams } from "@celo/payments-types";
import { jsonRpcSuccess, paymentNotFound } from "../helpers/json-rpc-wrapper";

export function getInfo(
  jsonRpcRequestId: number,
  params: GetPaymentInfoParams,
  res: ResponseToolkit
) {
  const item = get(params.referenceId);
  console.log("get info request", { params });
  if (item) {
    return jsonRpcSuccess(res, jsonRpcRequestId, item);
  }

  return paymentNotFound(res, jsonRpcRequestId, params.referenceId);
}
