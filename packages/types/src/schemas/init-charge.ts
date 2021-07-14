import { KYC } from "./kyc";

export interface InitCharge {
  kyc: KYC;
  transactionHash: string;
}
