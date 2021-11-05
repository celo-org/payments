import {
  AbortRequest,
  AbortResponse,
  GetPaymentInfoRequest,
  GetPaymentInfoResponse,
  InitChargeRequest,
  InitChargeResponse,
  JsonRpcProtocol,
  ReadyForSettlementRequest,
  ReadyForSettlementResponse,
} from "./schemas";

export * from "./schemas";
export * from "./methods";
export * from "./headers";

export type PaymentMessageRequest =
  | GetPaymentInfoRequest
  | InitChargeRequest
  | ReadyForSettlementRequest
  | AbortRequest;

export type PaymentMessageResponse =
  | GetPaymentInfoResponse
  | InitChargeResponse
  | ReadyForSettlementResponse
  | AbortResponse;

export type PaymentMessage = JsonRpcProtocol & PaymentMessageRequest;
