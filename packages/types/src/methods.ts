import {
  AbortRequest,
  GetPaymentInfoRequest,
  InitChargeRequest,
  ReadyForSettlementRequest,
} from "./schemas";

export enum JsonRpcMethods {
  GetInfo = GetPaymentInfoRequest.method.value,
  InitCharge = InitChargeRequest.method.value,
  ReadyForSettlement = ReadyForSettlementRequest.method.value,
  Abort = AbortRequest.method.value,
}
