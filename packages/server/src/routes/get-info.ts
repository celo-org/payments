import { Request, ResponseToolkit } from "@hapi/hapi";
import { get } from "../storage";

interface GetInfoRequest extends Request {
  params: {
    id: string;
  };
}

export function getInfo(req: GetInfoRequest, res: ResponseToolkit) {
  const referenceId = req.params.id;

  const item = get(referenceId);
  if (item) {
    return res.response(item).code(200);
  }

  return res.response().code(404);
}
