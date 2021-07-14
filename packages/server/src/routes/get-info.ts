import { Request, ResponseToolkit } from "@hapi/hapi";
import { get } from "../storage";

interface GetInfoRequest extends Request {
  params: {
    referenceId: string;
  };
}

export function getInfo(
  { params: { referenceId } }: GetInfoRequest,
  res: ResponseToolkit
) {
  const item = get(referenceId);
  if (item) {
    return res.response(item).code(200);
  }

  return res.response().code(404);
}
