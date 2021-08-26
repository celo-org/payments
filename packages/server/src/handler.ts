import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  InitCharge,
  GetPaymentInfo,
  JsonRpcMethods,
  GetPaymentInfoParams,
  InitChargeParams,
} from "@celo/payments-types";
import { getInfo, initCharge } from "./routes";

interface PaymentRequest extends Request {
  payload: GetPaymentInfo | InitCharge;
}

export function handle({ payload }: PaymentRequest, res: ResponseToolkit) {
  const method = payload.method.toString();
  switch (method) {
    case JsonRpcMethods.GetInfo:
      const getPaymentInfoParams = payload.params as GetPaymentInfoParams;
      return getInfo(getPaymentInfoParams, res);
    case JsonRpcMethods.Init:
      const initChargeParams = payload.params as InitChargeParams;
      return initCharge(initChargeParams, res);
    default:
      res.response(404).send();
  }
}
