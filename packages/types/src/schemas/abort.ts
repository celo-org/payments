import { AbortCode } from "../abort-codes";

export interface Abort {
  reference_id: string;
  abort_code: AbortCode;
  abort_message?: string;
}
