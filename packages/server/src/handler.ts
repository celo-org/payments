import {
  Abort,
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

interface Headers {
  [header: string]: string;
}

type PaymentPayload = GetPaymentInfo | InitCharge | ReadyForSettlement | Abort;

interface PaymentRequest extends Request {
  headers: Headers;
  payload: PaymentPayload;
}

let chainHandler = undefined;
export let useAuthentication: boolean = true;

export async function handle(
  { payload, headers }: PaymentRequest,
  res: ResponseToolkit
) {
  if (!chainHandler) {
    chainHandler = new ContractKitTransactionHandler(await getKit());
  }
  const method = payload.method.toString();

  const [authenticated, response] = await handleAuthentication(
    method,
    headers,
    payload,
    res
  );
  if (!authenticated) {
    return response;
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

async function handleAuthentication(
  method: string,
  headers: Headers,
  payload: PaymentPayload,
  res: ResponseToolkit
): Promise<[boolean, any]> {
  if (useAuthentication) {
    let typeDefinition;

    switch (method) {
      case GetPaymentInfoRequest.method.value:
        typeDefinition = EIP712Schemas.GetPaymentInfo;
        break;
      case InitChargeRequest.method.value:
        typeDefinition = EIP712Schemas.InitCharge;
        break;
      case ReadyForSettlementRequest.method.value:
        typeDefinition = EIP712Schemas.ReadyForSettlement;
        break;
      case AbortRequest.method.value:
        typeDefinition = EIP712Schemas.Abort;
        break;
    }

    const validSignature = await verifySignature(
      chainHandler,
      headers[OffchainHeaders.SIGNATURE.toLowerCase()],
      headers[OffchainHeaders.ADDRESS.toLowerCase()],
      payload,
      typeDefinition
    );
    if (!validSignature) {
      return [
        false,
        await unauthenticatedRequest(res, payload.id, chainHandler),
      ];
    }
  }
  return [true, undefined];
}
