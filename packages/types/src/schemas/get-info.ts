import { Address } from "@celo/base";
import { StableToken } from "@celo/contractkit";
import { JsonRpcMethods } from "../methods";
import { KYC } from "./kyc";

export interface GetInfo {
  method: JsonRpcMethods.GetInfo;
  params: {
    required_payer_data: KYC;
    receiver: {
      account_address: Address;
      business_data: {
        name: string;
        legal_name: string;
        address: string;
        city: string;
        country: string;
        line1: string;
        line2: string;
        postal_code: string;
        state: string;
      };
    };
    action: {
      amount: string;
      currency: StableToken;
      action: "charge";
      timestamp: string;
    };
    referenceId: string;
    description: string;
  };
}
