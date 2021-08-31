import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  GetPaymentInfo,
  GetPaymentInfoParams,
  InitCharge,
  InitChargeParams,
  JsonRpcMethods,
  ReadyForSettlement,
  ReadyForSettlementParams,
} from "@celo/payments-types";
import { getInfo, initCharge } from "./routes";
import { methodNotFound } from "./helpers/json-rpc-wrapper";
import { expectPayment } from "./routes/expect-payment";

interface PaymentRequest extends Request {
  payload: GetPaymentInfo | InitCharge | ReadyForSettlement;
}

export function handle({ payload }: PaymentRequest, res: ResponseToolkit) {
  const method = payload.method.toString();
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
    default:
      return methodNotFound(res, payload.id);
  }
}
