import { Address } from "@celo/contractkit";
import { JsonRpcMethods } from "../../methods";
import { KYC } from "./kyc";

export interface InitChargeRequest {
  method: JsonRpcMethods.Init;
  params: {
    referenceId: string;
    transactionHash: string;
    sender: {
      accountAddress: Address;
      payerData: KYC;
    };
  };
}
