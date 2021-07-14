import { KYC } from "@celo/payments-types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { get, has, update } from "../storage";

interface InitChargeRequest extends Request {
  params: {
    referenceId: string;
  };
  payload: {
    kyc: KYC;
    transactionHash: string;
  };
}

export function initCharge(
  { params: { referenceId }, payload: { transactionHash } }: InitChargeRequest,
  res: ResponseToolkit
) {
  if (!has(referenceId)) {
    return res.response().code(404);
  }

  console.log("initCharge", { transactionHash });

  update(referenceId, { ...get(referenceId), transactionHash });

  return res.response().code(204);
}
