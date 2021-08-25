import { JsonRpcMethods } from "../methods";
import { KYC } from "./kyc";

export interface InitCharge {
  method: JsonRpcMethods.Init;
  params: {
    referenceId: string;
    sender: {
      accountAddress: string;
      payerData: KYC;
    };
    transactionHash: string;
  };
}
