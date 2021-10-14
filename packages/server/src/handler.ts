import {
  AbortParams,
  AbortRequest,
  EIP712Schemas,
  GetPaymentInfo,
  GetPaymentInfoParams,
  GetPaymentInfoRequest,
  InitCharge,
  InitChargeParams,
  InitChargeRequest,
  JsonRpcMethods,
  OffchainHeaders,
  ReadyForSettlement,
  ReadyForSettlementParams,
  ReadyForSettlementRequest,
} from "@celo/payments-types";
import { Request, ResponseToolkit } from "@hapi/hapi";

import {
  ContractKitTransactionHandler,
  verifySignature,
} from "@celo/payments-sdk";
import {
  methodNotFound,
  unauthenticatedRequest,
} from "./helpers/json-rpc-wrapper";
import { abort, expectPayment, getInfo, initCharge } from "./routes";
import { getKit } from "./services";

interface PaymentRequest extends Request {
  headers: { [header: string]: string };
  payload: GetPaymentInfo | InitCharge | ReadyForSettlement;
}

let chainHandler = undefined;

export async function handle(
  { payload, headers }: PaymentRequest,
  res: ResponseToolkit
) {
  if (!chainHandler) {
    chainHandler = new ContractKitTransactionHandler(await getKit());
  }
  const method = payload.method.toString();
  let schema, schemaName;

  switch (method) {
    case GetPaymentInfoRequest.method.value:
      schema = EIP712Schemas.GetPaymentInfo;
      schemaName = "GetPaymentInfo";
      break;
    case InitChargeRequest.method.value:
      schema = EIP712Schemas.InitCharge;
      schemaName = "InitCharge";
      break;
    case ReadyForSettlementRequest.method.value:
      schema = EIP712Schemas.ReadyForSettlement;
      schemaName = "ReadyForSettlement";
      break;
    case AbortRequest.method.value:
      schema = EIP712Schemas.Abort;
      schemaName = "Abort";
      break;
  }

  const validSignature = await verifySignature(
    chainHandler,
    headers[OffchainHeaders.SIGNATURE.toLowerCase()],
    headers[OffchainHeaders.ADDRESS.toLowerCase()],
    payload,
    schema,
    schemaName
  );
  if (!validSignature) {
    return unauthenticatedRequest(res, payload.id, chainHandler);
  }

  switch (method) {
    case JsonRpcMethods.GetInfo:
      const getPaymentInfoParams = payload.params as GetPaymentInfoParams;
      return getInfo(payload.id, getPaymentInfoParams, chainHandler, res);
    case JsonRpcMethods.InitCharge:
      const initChargeParams = payload.params as InitChargeParams;
      return initCharge(payload.id, initChargeParams, chainHandler, res);
    case JsonRpcMethods.ReadyForSettlement:
      const readyForSettlementParams =
        payload.params as ReadyForSettlementParams;
      return expectPayment(
        payload.id,
        readyForSettlementParams,
        chainHandler,
        res
      );
    case JsonRpcMethods.Abort:
      const abortParams = payload.params as AbortParams;
      return abort(payload.id, abortParams, chainHandler, res);
    default:
      return methodNotFound(res, payload.id, chainHandler);
  }
}
