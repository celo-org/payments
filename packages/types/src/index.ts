import {
  AbortRequest,
  GetPaymentInfoRequest,
  InitChargeRequest,
  ReadyForSettlementRequest,
} from "./schemas";

export * from "./schemas";
export * from "./methods";

export type PaymentMessageRequest =
  | GetPaymentInfoRequest
  | InitChargeRequest
  | ReadyForSettlementRequest
  | AbortRequest;
