import { Request, RouteEventHandler, ResponseToolkit } from "@hapi/hapi";
import { GetInfo } from "@celo/payments-types";
import { get } from "../storage";

interface GetInfoRequest extends Request {
  // ...GetInfo
  params: {
    id: string;
  };
}

export function getInfo(
  req: GetInfoRequest,
  res: ResponseToolkit
): RouteEventHandler {
  const referenceId = req.params.id;

  const item = get(referenceId);
  if (item) {
    res.response().code(404);
    return;
  }

  res.response(item).code(200);
}
