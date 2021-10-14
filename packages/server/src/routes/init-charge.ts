import {
  EIP712Schemas,
  InitChargeParams,
  JsonRpcError,
} from "@celo/payments-types";
import { ResponseToolkit } from "@hapi/hapi";
import { get, has, update } from "../storage";
import { riskChecks, RiskChecksResult } from "../helpers";
import {
  jsonRpcError,
  jsonRpcSuccess,
  paymentNotFound,
} from "../helpers/json-rpc-wrapper";
import { ChainHandler } from "@celo/payments-sdk";

export function initCharge(
  jsonRpcRequestId: number,
  params: InitChargeParams,
  chainHandler: ChainHandler,
  res: ResponseToolkit
) {
  if (!has(params.referenceId)) {
    return paymentNotFound(
      res,
      jsonRpcRequestId,
      chainHandler,
      params.referenceId
    );
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

    return jsonRpcError(
      res,
      jsonRpcRequestId,
      chainHandler,
      riskCheckFailedJsonRpcError
    );
  }

  return jsonRpcSuccess(
    res,
    jsonRpcRequestId,
    chainHandler,
    EIP712Schemas.InitChargeResponse
  );
}
