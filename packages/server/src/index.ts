import * as Hapi from "@hapi/hapi";
import { getInfo, initCharge, confirmation, abort } from "./routes";

export default async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  server.route({
    method: "GET",
    path: "/payments/{referenceId}",
    handler: getInfo,
  });
  server.route({
    method: "POST",
    path: "/payments/{referenceId}",
    handler: initCharge,
  });
  server.route({
    method: "GET",
    path: "/payments/{referenceId}/confirmation",
    handler: confirmation,
  });
  server.route({
    method: "POST",
    path: "/payments/{referenceId}/abort",
    handler: abort,
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};
