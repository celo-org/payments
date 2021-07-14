import { Request, ResponseToolkit } from "@hapi/hapi";
import { has } from "../storage";

interface InitChargeRequest extends Request {
  params: {
    id: string;
  };
}

export function initCharge(req: InitChargeRequest, res: ResponseToolkit) {
  const referenceId = req.params.id;

  if (!has(referenceId)) {
    return res.response().code(404);
  }

  return res.response().code(204);
}
