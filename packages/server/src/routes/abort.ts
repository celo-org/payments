import { Request, ResponseToolkit } from "@hapi/hapi";
import { get } from "../storage";

interface AbortRequest extends Request {
  params: {
    id: string;
  };
  body: {};
}

export function abort(req: AbortRequest, res: ResponseToolkit) {
  const referenceId = req.params.id;

  const item = get(referenceId);
  if (!item) {
    return res.response().code(404);
  }

  return res.response().code(204);
}
