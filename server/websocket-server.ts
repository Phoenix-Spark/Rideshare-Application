import { WebSocketServer } from "ws";
import { createServer } from "http";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.WS_PORT || 3001;

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
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
  const { userId } = req.params;
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
    res.json({ success: true, clientsSent: userClients.size });
  } else {
    res.json({ success: false, message: "User not connected" });
  }
});

// Endpoint to broadcast to all users
app.post("/broadcast", (req, res) => {
  const data = req.body;
  const message = JSON.stringify(data);
  console.log('data;', data)
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
  
  res.json({ success: true, clientsSent: sentCount });
});

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");
  let userId: string | null = null;

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('data: ', data)
      
      if (data.type === "auth" && data.userId) {
        userId = data.userId;
        
        if (!wsClients.has(userId)) {
          wsClients.set(userId, new Set());
        }
        wsClients.get(userId)!.add(ws);
        
        console.log(`User ${userId} authenticated. Total connections: ${wsClients.get(userId)!.size}`);
        ws.send(JSON.stringify({ type: "auth", status: "success" }));
      }
      
      if (data.type === "ping") {
        ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
      }
      
    } catch (error) {
      console.error("WebSocket message error:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    if (userId) {
      const userClients = wsClients.get(userId);
      if (userClients) {
        userClients.delete(ws);
        if (userClients.size === 0) {
          wsClients.delete(userId);
          console.log(`User ${userId} fully disconnected`);
        }
      }
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});