import {
  GetPaymentInfoRequest,
  InitChargeRequest,
  ReadyForSettlementRequest,
} from "./schemas";

export enum JsonRpcMethods {
  GetInfo = GetPaymentInfoRequest.method.GET_PAYMENT_INFO,
  Init = InitChargeRequest.method.INIT_CHARGE,
  Confirm = ReadyForSettlementRequest.method.READY_FOR_SETTLEMENT,
}
