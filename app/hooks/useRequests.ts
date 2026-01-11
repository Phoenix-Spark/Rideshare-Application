import { useEffect, useRef, useState } from "react";
import { useRevalidator } from "react-router";

interface UseRequestSSEOptions {
  onNewRequest?: (request: any) => void;
}

export function useRequestSSE({ onNewRequest }: UseRequestSSEOptions = {}) {
  const revalidator = useRevalidator();
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const onNewRequestRef = useRef(onNewRequest);
  const revalidatorRef = useRef(revalidator);

  useEffect(() => {
    onNewRequestRef.current = onNewRequest;
    revalidatorRef.current = revalidator;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      return;
    }

    const eventSource = new EventSource("/broadcast/sse");
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "NEW_REQUEST") {
          onNewRequestRef.current?.(data.request);
          revalidatorRef.current.revalidate();
        }
      } catch (error) {
        console.error("Parse error:", error);
      }
    };

    eventSource.onerror = (error) => {
      setIsConnected(false);
    };

    return () => {
      console.log("🧹 Cleanup: Closing connection");
      eventSource.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    };
  }, []);

  return { isConnected };
}