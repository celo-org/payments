export * from "./abort";
export * from "./get-info";
export * from "./init-charge";
export * from "./confirm";
export * from "./kyc";

import { AbortRequest } from "./abort";
import { GetInfoRequest } from "./get-info";
import { InitChargeRequest } from "./init-charge";
import { ConfirmRequest } from "./confirm";

export type PaymentMessageRequest =
  | AbortRequest
  | GetInfoRequest
  | InitChargeRequest
  | ConfirmRequest;
