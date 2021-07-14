import { Request, ResponseToolkit } from "@hapi/hapi";
import { Abort } from "@celo/payments-types";
import { get } from "../storage";

interface AbortRequest extends Request {
  params: {
    referenceId: string;
  };
  body: Abort;
}

export function abort(
  {
    params: { referenceId },
    body: { abort_code, abort_message },
  }: AbortRequest,
  res: ResponseToolkit
) {
  const item = get(referenceId);
  if (!item) {
    return res.response().code(404);
  }

  console.log("abort", {
    referenceId,
    abortCode: abort_code,
    abortMessage: abort_message,
  });
  return res.response().code(204);
}
