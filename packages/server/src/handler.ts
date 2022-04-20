import {
  AuthenticationHeaders,
  ContractKitTransactionHandler,
  verifyRequestSignature,
} from "@celo/payments-sdk";
import {
  Abort,
  GetPaymentInfo,
  InitCharge,
  InitChargeParams,
  JsonRpcMethods,
  ReadyForSettlement,
} from "@celo/payments-types";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
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
let useAuthentication = true;

export function setUseAuthentication(flag: boolean) {
  useAuthentication = flag;
}

export async function handle(
  { payload, headers }: PaymentRequest,
  res: ResponseToolkit
) {
  if (!chainHandler) {
    chainHandler = new ContractKitTransactionHandler(await getKit());
  }

  const [authenticated, response] = await handleAuthentication(
    headers,
    payload,
    res
  );
  if (!authenticated) {
    return response;
  }

  const method = payload.method.toString() as JsonRpcMethods;
  switch (method) {
    case JsonRpcMethods.GetInfo:
      return getInfo(payload.id, payload.params, chainHandler, res);
    case JsonRpcMethods.InitCharge:
      return initCharge(
        payload.id,
        payload.params as InitChargeParams,
        chainHandler,
        res
      );
    case JsonRpcMethods.ReadyForSettlement:
      return expectPayment(payload.id, payload.params, chainHandler, res);
    case JsonRpcMethods.Abort:
      return abort(payload.id, payload.params, chainHandler, res);
    default:
      return methodNotFound(res, payload.id, chainHandler);
  }
}

async function handleAuthentication(
  headers: Headers,
  payload: PaymentPayload,
  res: ResponseToolkit
): Promise<[true, void] | [false, ResponseObject]> {
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
