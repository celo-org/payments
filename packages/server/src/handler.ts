import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  InitCharge,
  GetPaymentInfo,
  JsonRpcMethods,
} from "@celo/payments-types";
import { abort, confirmation, getInfo, initCharge } from "./routes";

interface PaymentRequest extends Request {
  payload: GetPaymentInfo | InitCharge;
}

export function handle({ payload }: PaymentRequest, res: ResponseToolkit) {
  if (payload.method === JsonRpcMethods.GetInfo) {
    return getInfo(payload, res);
  } else if (payload.method === JsonRpcMethods.Init) {
    return initCharge(payload, res);
  } else {
    res.response(404).send();
  }
}
