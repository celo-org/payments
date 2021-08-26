import {
  GetPaymentInfoParams,
  InitChargeParams,
  ReadyForSettlementParams,
} from "./schemas";

export enum JsonRpcMethods {
  GetInfo = GetPaymentInfoParams.method.GET_PAYMENT_INFO,
  Init = InitChargeParams.method.INIT_CHARGE,
  Confirm = ReadyForSettlementParams.method.READY_FOR_SETTLEMENT,
}
