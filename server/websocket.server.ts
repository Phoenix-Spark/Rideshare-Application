import { WebSocketServer } from "ws";

// Use global to ensure single instance across all imports
declare global {
  var __wss: WebSocketServer | undefined;
  var __wsClients: Map<string, Set<any>> | undefined;
}

// Initialize from global or create new
const getWss = () => global.__wss;
const getClients = () => {
  if (!global.__wsClients) {
    global.__wsClients = new Map<string, Set<any>>();
  }
  return global.__wsClients;
};

export function initializeWebSocket(websocketServer: WebSocketServer) {
  console.log("🟢 initializeWebSocket called");
  global.__wss = websocketServer;
  
  websocketServer.on("connection", (ws) => {
    console.log("WebSocket client connected");
    
    let userId: string | null = null;

    ws.on("message", async (message) => {
      console.log("message", message);
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === "auth" && data.userId) {
          userId = data.userId;
          
          const clients = getClients();
          if (!clients.has(userId)) {
            clients.set(userId, new Set());
          }
          clients.get(userId)!.add(ws);
          
          ws.send(JSON.stringify({ type: "auth", status: "success" }));
          console.log(`User ${userId} authenticated via WebSocket`);
        }
        
        if (data.type === "ping") {
          ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
        }
        
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      
      if (userId) {
        const clients = getClients();
        const userClients = clients.get(userId);
        if (userClients) {
          userClients.delete(ws);
          if (userClients.size === 0) {
            clients.delete(userId);
          }
        }
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });
}

export function broadcastToUser(userId: string, data: any) {
  const wss = getWss();
  const clients = getClients();
  
  if (!wss) {
    console.warn("⚠️ WebSocket server not available, skipping broadcast");
    return;
  }
  
  const userClients = clients.get(userId);
  if (userClients) {
    const message = JSON.stringify(data);
    console.log('message: ', message)
    userClients.forEach((client) => {
      if (client.readyState === 1) {
        try {
          client.send(message);
        } catch (error) {
          console.error("Error sending to client:", error);
        }
      }
    });
  }
}

export function broadcastToAll(data: any) {
  const wss = getWss();
  
  // console.log("data: ", data);
  // console.log("wss: ", wss);
  // console.log("🔴 broadcastToAll called, wss is:", wss ? "SET" : "NULL");
  // console.log("🔴 wss.clients count:", wss?.clients?.size || 0);
  
  if (!wss) {
    console.warn("⚠️ WebSocket server not available, skipping broadcast");
    return;
  }
  
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      try {
        client.send(message);
        console.log("✅ Message sent to client");
      } catch (error) {
        console.error("Error sending to client:", error);
      }
    }
  });
}

export function notifyDriversOfNewRide(rideId: string, pickupLocation: string) {
  console.log("🟣 notifyDriversOfNewRide called");
  broadcastToAll({
    type: "new_ride_request",
    rideId: rideId,
    pickupLocation: pickupLocation
  });
}

export function notifyRiderOfConfirmation(rideId: string, userId: string){
  broadcastToUser(userId, {rideId: rideId, confirm: true, type: "accept_ride_request"})
}

export function notifyDriverOfCancelation(rideId: string, userId: string){
  console.log('driverId: ', userId)
  broadcastToUser(userId, {
    type: "user_cancelled_request",
    rideId: rideId,
  })
}

export function notifyPassengerOfPickup(requestId: string, userId: string){
  console.log('request: ', requestId, ' userId: ', userId);
  broadcastToUser(userId, {type: "user_picked_up", rideId: requestId})
}

export function notifyPassengerOfDropoff(requestId: string, userId: string){
  broadcastToUser(userId, {type: "user_dropped_off", rideId: requestId})
}