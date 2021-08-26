import { InitChargeParams } from "@celo/payments-types";
import { ResponseToolkit } from "@hapi/hapi";
import { get, has, update } from "../storage";

export function initCharge(params: InitChargeParams, res: ResponseToolkit) {
  if (!has(params.referenceId)) {
    return res.response().code(404);
  }

  console.log("initCharge", params);

  update(params.referenceId, {
    ...get(params.referenceId),
    transactionHash: params.transactionHash,
  });

  return res.response().code(204);
}
