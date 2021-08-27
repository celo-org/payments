import { PaymentSender } from "@celo/payments-types";

export enum RiskChecksResult {
  Ok,
  Fail,
}
export function riskChecks(sender: PaymentSender): RiskChecksResult {
  if (sender.payerData.phoneNumber === "1234567890") {
    return RiskChecksResult.Fail;
  }
  return RiskChecksResult.Ok;
}
