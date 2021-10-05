import {
  AbortParams,
  GetPaymentInfo,
  GetPaymentInfoParams,
  InitCharge,
  InitChargeParams,
  JsonRpcMethods,
  ReadyForSettlement,
  ReadyForSettlementParams,
} from "@celo/payments-types";
import { Request, ResponseToolkit } from "@hapi/hapi";

import { verifySignature } from "./auth";
import { methodNotFound, unauthorized } from "./helpers/json-rpc-wrapper";
import { abort, expectPayment, getInfo, initCharge } from "./routes";

interface PaymentRequest extends Request {
  headers: { [header: string]: string };
  payload: GetPaymentInfo | InitCharge | ReadyForSettlement;
}

export function handle(
  { payload, headers }: PaymentRequest,
  res: ResponseToolkit
) {
  const method = payload.method.toString();

  if (!verifySignature(headers.authorization, headers.address, payload)) {
    return unauthorized(res, payload.id);
  }

  switch (method) {
    case JsonRpcMethods.GetInfo:
      const getPaymentInfoParams = payload.params as GetPaymentInfoParams;
      return getInfo(payload.id, getPaymentInfoParams, res);
    case JsonRpcMethods.InitCharge:
      const initChargeParams = payload.params as InitChargeParams;
      return initCharge(payload.id, initChargeParams, res);
    case JsonRpcMethods.ReadyForSettlement:
      const readyForSettlementParams =
        payload.params as ReadyForSettlementParams;
      return expectPayment(payload.id, readyForSettlementParams, res);
    case JsonRpcMethods.Abort:
      const abortParams = payload.params as AbortParams;
      return abort(payload.id, abortParams, res);
    default:
      return methodNotFound(res, payload.id);
  }
}
