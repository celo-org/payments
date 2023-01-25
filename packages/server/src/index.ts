import * as Hapi from "@hapi/hapi";
import { handle } from "./handler";
import { getKit } from "./services";

export default async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
    debug: { request: ["*"] },
  });

  server.events.on("response", function (request) {
    console.log(
      request.info.remoteAddress +
        ": " +
        request.method.toUpperCase() +
        " " +
        request.path +
        " --> " +
        request.response.message
    );
  });

  server.route({
    method: "POST",
    path: "/rpc",
    handler: handle,
  });

  await getKit();

  await server.start();
  console.log("Server running on %s", server.info.uri);
};
