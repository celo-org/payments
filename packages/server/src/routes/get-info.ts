import { ResponseToolkit } from "@hapi/hapi";
import { get } from "../storage";
import { GetPaymentInfoParams } from "@celo/payments-types";

export function getInfo(params: GetPaymentInfoParams, res: ResponseToolkit) {
  const item = get(params.referenceId);
  console.log("get info request", { params });
  if (item) {
    return res.response(item).code(200);
  }

  return res.response().code(404);
}
