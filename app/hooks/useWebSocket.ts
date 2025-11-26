import { useEffect, useRef, useState } from "react";

export function useWebSocket(userId: string | null) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!userId) return;

    const connect = () => {
      // Connect to external WebSocket server
      const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:3001";
      
      console.log(`Connecting to WebSocket server at ${wsUrl}`);
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("Connected to WebSocket server");
        setIsConnected(true);
        ws.current?.send(JSON.stringify({ type: "auth", userId }));
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);
        setMessages((prev) => [...prev, data]);
      };

      ws.current.onclose = () => {
        console.log("Disconnected from WebSocket server");
        setIsConnected(false);
        reconnectTimeout.current = setTimeout(() => {
          console.log("Attempting to reconnect...");
          connect();
        }, 3000);
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      ws.current?.close();
    };
  }, [userId]);

  const sendMessage = (data: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not connected");
    }
  };

  return { isConnected, messages, sendMessage };
}