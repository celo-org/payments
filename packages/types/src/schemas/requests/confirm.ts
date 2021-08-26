import { JsonRpcMethods } from "../../methods";

export interface ConfirmRequest {
  method: JsonRpcMethods.Confirm;
  params: {
    referenceId: string;
  };
}
