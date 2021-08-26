import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  AbortRequest,
  InitChargeRequest,
  GetInfoRequest,
  JsonRpcMethods,
  ConfirmRequest,
} from "@celo/payments-types";
import { abort, confirmation, getInfo, initCharge } from "./routes";

interface PaymentRequest extends Request {
  payload: AbortRequest | InitChargeRequest | GetInfoRequest | ConfirmRequest;
}

export function handle({ payload }: PaymentRequest, res: ResponseToolkit) {
  if (payload.method === JsonRpcMethods.Abort) {
    return abort(payload, res);
  } else if (payload.method === JsonRpcMethods.GetInfo) {
    return getInfo(payload, res);
  } else if (payload.method === JsonRpcMethods.Confirm) {
    return confirmation(payload, res);
  } else if (payload.method === JsonRpcMethods.Init) {
    return initCharge(payload, res);
  } else {
    res.response(404).send();
  }
}
