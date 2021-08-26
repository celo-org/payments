import { ResponseToolkit } from "@hapi/hapi";
import { AbortRequest } from "@celo/payments-types";
import { get } from "../storage";

export function abort({ params }: AbortRequest, res: ResponseToolkit) {
  const item = get(params.referenceId);
  if (!item) {
    return res.response().code(404);
  }

  console.log("abort", params);
  return res.response().code(204);
}
