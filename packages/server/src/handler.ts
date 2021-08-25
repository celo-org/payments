import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  Abort,
  InitCharge,
  GetInfo,
  JsonRpcMethods,
  Confirm,
} from "@celo/payments-types";
import { abort, confirmation, getInfo, initCharge } from "./routes";

interface PaymentRequest extends Request {
  body: Abort | InitCharge | GetInfo | Confirm;
}

export function handle({ body }: PaymentRequest, res: ResponseToolkit) {
  if (body.method === JsonRpcMethods.Abort) {
    return abort(body, res);
  } else if (body.method === JsonRpcMethods.GetInfo) {
    return getInfo(body, res);
  } else if (body.method === JsonRpcMethods.Confirm) {
    return confirmation(body, res);
  } else if (body.method === JsonRpcMethods.Init) {
    return initCharge(body, res);
  } else {
    res.response(404).send();
  }
}
