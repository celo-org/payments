import { AbortCode } from "../../abort-codes";
import { JsonRpcMethods } from "../../methods";

export interface AbortRequest {
  method: JsonRpcMethods.Abort;
  params: {
    referenceId: string;
    abort_code: AbortCode;
    abort_message?: string;
  };
}
