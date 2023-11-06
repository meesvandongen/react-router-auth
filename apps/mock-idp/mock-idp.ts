import { OAuth2Server } from "oauth2-mock-server";

export { OAuth2Server } from "oauth2-mock-server";
import type { Express } from "express";

export async function startServer(
  port = 8080,
  log = (...items: any[]) => console.log(...items)
) {
  const server = new OAuth2Server();

  (server.service.requestHandler as Express).get(
    `/connect/endSession`,
    (req, res) => {
      server.service.emit("customBeforePostLogoutRedirect", req, res);
      res.status(204).end();
    }
  );

  await server.issuer.keys.generate("RS256");

  await server.start(port, "localhost");

  const addr = server.address();

  log(`OAuth 2 server listening on http://${addr.address}:${addr.port}`);

  server.service.on("beforeTokenSigning", (token, req) => {
    const timestamp = Math.floor(Date.now() / 1000);
    token.payload.exp = timestamp + 130;
  });

  process.once("SIGINT", () => {
    log("OAuth 2 server is stopping...");

    server.stop().then(
      () => {
        log("OAuth 2 server has been stopped.");
      },
      (err) => {
        console.error("OAuth 2 server has not been stopped due to error:", err);
      }
    );
  });

  return server;
}
