import {
  AuthenticationHeaders,
  ContractKitTransactionHandler,
  verifyRequestSignature,
} from "@celo/payments-sdk";
import {
  Abort,
  AbortParams,
  GetPaymentInfo,
  GetPaymentInfoParams,
  InitCharge,
  InitChargeParams,
  JsonRpcMethods,
  ReadyForSettlement,
  ReadyForSettlementParams,
} from "@celo/payments-types";
import { Request, ResponseToolkit } from "@hapi/hapi";
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
    chainHandler = await new ContractKitTransactionHandler(
      await getKit()
    ).withDekAddress();
  }

  const [authenticated, response] = await handleAuthentication(
    headers,
    payload,
    res
  );
  if (!authenticated) {
    return response;
  }

  const method = payload.method.toString();
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
  headers: Headers,
  payload: PaymentPayload,
  res: ResponseToolkit
): Promise<[boolean, any]> {
  if (useAuthentication) {
    const validSignature = await verifyRequestSignature(
      chainHandler,
      headers as unknown as AuthenticationHeaders,
      payload
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
