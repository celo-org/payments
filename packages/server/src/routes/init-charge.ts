import { InitChargeParams, JsonRpcError } from "@celo/payments-types";
import { ResponseToolkit } from "@hapi/hapi";
import { get, has, update } from "../storage";
import { riskChecks, RiskChecksResult } from "../helpers";
import {
  jsonRpcError,
  jsonRpcSuccess,
  paymentNotFound,
} from "../helpers/json-rpc-wrapper";

export function initCharge(
  jsonRpcRequestId: number,
  params: InitChargeParams,
  res: ResponseToolkit
) {
  if (!has(params.referenceId)) {
    return paymentNotFound(res, jsonRpcRequestId, params.referenceId);
  }

  console.log("initCharge", params);

  if (riskChecks(params.sender) === RiskChecksResult.Ok) {
    update(params.referenceId, {
      ...get(params.referenceId),
      transactionHash: params.transactionHash,
    });
  } else {
    const message = "Risk checks failed!";
    console.log(message);
    const riskCheckFailedJsonRpcError = <JsonRpcError>{
      code: -32602,
      message,
    };

    return jsonRpcError(res, jsonRpcRequestId, riskCheckFailedJsonRpcError);
  }

  return jsonRpcSuccess(res, jsonRpcRequestId);
}
