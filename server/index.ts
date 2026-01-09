import { createRequestHandler } from "@react-router/express";
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { initializeWebSocket } from "./websocket.server.js";

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const app = express();
const httpServer = createServer(app);

if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  app.use(
    "/assets",
    express.static("build/client/assets", {
      immutable: true,
      maxAge: "1y",
    })
  );
  app.use(express.static("build/client", { maxAge: "1h" }));
}

const wss = new WebSocketServer({ server: httpServer });
initializeWebSocket(wss);

app.all(
  "*",
  createRequestHandler({
    build: viteDevServer
      ? () => viteDevServer.ssrLoadModule("virtual:react-router/server-build")
      : await import("../build/server/index.js"),
  })
);

const port = process.env.DOMAIN_PORT || 3000;
httpServer.listen(port, () => {
});