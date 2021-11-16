import { ResponseToolkit } from "@hapi/hapi";
import { get } from "../storage";
import { EIP712Schemas, GetPaymentInfoParams } from "@celo/payments-types";
import { jsonRpcSuccess, paymentNotFound } from "../helpers/json-rpc-wrapper";
import { ChainHandler } from "@celo/payments-sdk";

export function getInfo(
  jsonRpcRequestId: number,
  params: GetPaymentInfoParams,
  chainHandler: ChainHandler,
  res: ResponseToolkit
) {
  const item = get(params.referenceId);
  console.log("get info request", { params });
  if (item) {
    return jsonRpcSuccess(
      res,
      jsonRpcRequestId,
      chainHandler,
      EIP712Schemas.GetPaymentInfoResponse,
      item
    );
  }

  return paymentNotFound(
    res,
    jsonRpcRequestId,
    chainHandler,
    params.referenceId
  );
}
