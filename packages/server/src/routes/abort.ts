import { ResponseToolkit } from "@hapi/hapi";
import { get } from "../storage";

export function abort({ params }: any, res: ResponseToolkit) {
  const item = get(params.referenceId);
  if (!item) {
    return res.response().code(404);
  }

  console.log("abort", params);
  return res.response().code(204);
}
