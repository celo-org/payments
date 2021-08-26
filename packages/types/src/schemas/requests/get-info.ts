import { JsonRpcMethods } from "../../methods";

export interface GetInfoRequest {
  method: JsonRpcMethods.GetInfo;
  params: {
    referenceId: string;
  };
}
