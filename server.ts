import express from "express";
import morgan from "morgan";
import cors from "cors";
import {createServer} from "http";
import {WebSocketServer} from "ws";
import {type ServerBuild} from "react-router";
import {createRequestHandler} from "@react-router/express";

const BUILD_PATH = './build/server/index.js';
const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PORT = Number.parseInt(process.env.PORT || '3000');

const app = express();

const server = createServer(app);

app.disable('x-powered-by');
app.use(cors({
  origin: `http://${process.env.VITE_DOMAIN}:${process.env.VITE_DOMAIN_PORT}`,
  credentials: true
}));

app.use(express.json());

// Store connected clients by userId
const wsClients = new Map<string, Set<any>>();

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    totalClients: Array.from(wsClients.values()).reduce((sum, set) => sum + set.size, 0),
    connectedUsers: wsClients.size
  });
});

// Endpoint to broadcast to specific user
app.post("/notify/:userId", (req, res) => {
  const {userId} = req.params;
  const data = req.body;

  const userClients = wsClients.get(userId);
  if (userClients) {
    const message = JSON.stringify(data);
    userClients.forEach((client) => {
      if (client.readyState === 1) {
        try {
          client.send(message);
        } catch (error) {
          console.error("Error sending to client:", error);
        }
      }
    });
    res.json({success: true, clientsSent: userClients.size});
  } else {
    res.json({success: false, message: "User not connected"});
  }
});

// Endpoint to broadcast to all users
app.post("/broadcast", (req, res) => {
  const data = req.body;
  const message = JSON.stringify(data);
  let sentCount = 0;
  wsClients.forEach((clients) => {
    clients.forEach((client) => {
      if (client.readyState === 1) {
        try {
          client.send(message);
          sentCount++;
        } catch (error) {
          console.error("Error sending to client:", error);
        }
      }
    });
  });

  res.json({success: true, clientsSent: sentCount});
});

const wss = new WebSocketServer({server});

wss.on("connection", (ws) => {
  let userId: string | null = null;

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === "auth" && data.userId) {
        userId = data.userId;

        if (!wsClients.has(userId)) {
          wsClients.set(userId, new Set());
        }
        wsClients.get(userId)!.add(ws);

        ws.send(JSON.stringify({type: "auth", status: "success"}));
      }

      if (data.type === "ping") {
        ws.send(JSON.stringify({type: "pong", timestamp: Date.now()}));
      }

    } catch (error) {
      console.error("WebSocket message error:", error);
    }
  });

  ws.on("close", () => {
    if (userId) {
      const userClients = wsClients.get(userId);
      if (userClients) {
        userClients.delete(ws);
        if (userClients.size === 0) {
          wsClients.delete(userId);
        }
      }
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

if (DEVELOPMENT) {
  console.log('Starting development server...');
  const viteDevServer = await import('vite').then((vite) => vite.createServer({
    server: {middlewareMode: true}
  }));

  app.use(morgan('combined'));
  app.use(viteDevServer.middlewares);

  app.use(async (req, res, next) => {
    try {
      const source = await viteDevServer.ssrLoadModule("./server/app.ts")
      return await source.app(req, res, next);
    } catch (e) {
      if (typeof e === 'object' && e instanceof Error) {
        viteDevServer.ssrFixStacktrace(e);
      }
      next(e);
    }
  });
} else {
  console.log('Starting production server...');
  app.use('/assets', express.static('build/client/assets', {immutable: true, maxAge: '1y'}));
  app.use(morgan('tiny'));
  app.use(express.static('build/client', {maxAge: '1h'}));
  const prodApp = await import(BUILD_PATH) as unknown as ServerBuild;
  app.use(createRequestHandler({
    build: prodApp, getLoadContext() {
      return {VALUE_FROM_EXPRESS: 'Hello from Express!'}
    }
  }));
}

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});