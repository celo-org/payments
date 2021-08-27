import {
  GetPaymentInfoRequest,
  InitChargeRequest,
  ReadyForSettlementRequest,
} from "./schemas";

export enum JsonRpcMethods {
  GetInfo = GetPaymentInfoRequest.method.GET_PAYMENT_INFO,
  InitCharge = InitChargeRequest.method.INIT_CHARGE,
  ReadyForSettlement = ReadyForSettlementRequest.method.READY_FOR_SETTLEMENT,
}
