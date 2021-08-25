import { JsonRpcMethods } from "../methods";

export interface Confirm {
  method: JsonRpcMethods.Confirm;
  params: {
    referenceId: string;
  };
}
