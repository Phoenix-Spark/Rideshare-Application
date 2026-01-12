import { useEffect, useRef, useState } from "react";
import { useRevalidator } from "react-router";

export type SSEEventType =
  | "new_request"
  | "renew_request"
  | "request_accepted"
  | "request_cancelled"
  | "request_cancelled_passenger"
  | "request_pickup"
  | "request_complete"
  | "connected"
  | "heartbeat";

interface SSEOptions {
  onNewRequest?: (data: unknown) => void;
  onRenewRequest?: (data: unknown) => void;
  onRequestAccepted?: (data: unknown) => void;
  onRequestCancelled?: (data: unknown) => void;
  onRequestPickup?: (data: unknown) => void;
  onRequestComplete?: (data: unknown) => void;
  onConnected?: (data: unknown) => void;
  autoRevalidate?: boolean;
}

interface SSEState {
  isConnected: boolean;
  lastEventTime: number | null;
  error: string | null;
}

export function useSSE(options: SSEOptions = {}) {
  const { autoRevalidate = true } = options;
  const revalidator = useRevalidator();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);

  // Use refs to avoid effect re-runs
  const optionsRef = useRef(options);
  const revalidatorRef = useRef(revalidator);
  const autoRevalidateRef = useRef(autoRevalidate);

  // Keep refs up to date
  useEffect(() => {
    optionsRef.current = options;
    revalidatorRef.current = revalidator;
    autoRevalidateRef.current = autoRevalidate;
  });

  const [state, setState] = useState<SSEState>({
    isConnected: false,
    lastEventTime: null,
    error: null,
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const connect = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const eventSource = new EventSource("/api/sse", {
        withCredentials: true,
      });
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log("[SSE] Connected");
        setState((prev) => ({ ...prev, isConnected: true, error: null }));
        reconnectAttemptsRef.current = 0;
      };

      eventSource.onerror = () => {
        console.log("[SSE] Error, reconnecting...");
        setState((prev) => ({
          ...prev,
          isConnected: false,
          error: "Connection lost",
        }));
        eventSource.close();
        eventSourceRef.current = null;

        const delay = Math.min(
          1000 * Math.pow(2, reconnectAttemptsRef.current),
          30000
        );
        reconnectAttemptsRef.current += 1;

        reconnectTimeoutRef.current = setTimeout(connect, delay);
      };

      eventSource.addEventListener("connected", (e) => {
        const data = JSON.parse(e.data);
        console.log("[SSE] Received connected event", data);
        setState((prev) => ({ ...prev, lastEventTime: Date.now() }));
        optionsRef.current.onConnected?.(data);
      });

      eventSource.addEventListener("new_request", (e) => {
        const data = JSON.parse(e.data);
        console.log("[SSE] Received new_request event", data);
        setState((prev) => ({ ...prev, lastEventTime: Date.now() }));
        optionsRef.current.onNewRequest?.(data);
        if (autoRevalidateRef.current) {
          revalidatorRef.current.revalidate();
        }
      });

      eventSource.addEventListener("renew_request", (e) => {
        const data = JSON.parse(e.data);
        console.log("[SSE] Received renew_request event", data);
        setState((prev) => ({ ...prev, lastEventTime: Date.now() }));
        optionsRef.current.onRenewRequest?.(data);
        if (autoRevalidateRef.current) {
          revalidatorRef.current.revalidate();
        }
      });

      eventSource.addEventListener("request_accepted", (e) => {
        const data = JSON.parse(e.data);
        console.log("[SSE] Received request_accepted event", data);
        setState((prev) => ({ ...prev, lastEventTime: Date.now() }));
        optionsRef.current.onRequestAccepted?.(data);
        if (autoRevalidateRef.current) {
          revalidatorRef.current.revalidate();
        }
      });

      eventSource.addEventListener("request_cancelled", (e) => {
        const data = JSON.parse(e.data);
        console.log("[SSE] Received request_cancelled event", data);
        setState((prev) => ({ ...prev, lastEventTime: Date.now() }));
        optionsRef.current.onRequestCancelled?.(data);
        if (autoRevalidateRef.current) {
          revalidatorRef.current.revalidate();
        }
      });

      eventSource.addEventListener("request_cancelled_passenger", (e) => {
        const data = JSON.parse(e.data);
        console.log("[SSE] Received request_cancelled_passenger event", data);
        setState((prev) => ({ ...prev, lastEventTime: Date.now() }));
        optionsRef.current.onRequestCancelled?.(data);
        if (autoRevalidateRef.current) {
          revalidatorRef.current.revalidate();
        }
      });

      eventSource.addEventListener("request_pickup", (e) => {
        const data = JSON.parse(e.data);
        console.log("[SSE] Received request_pickup event", data);
        setState((prev) => ({ ...prev, lastEventTime: Date.now() }));
        optionsRef.current.onRequestPickup?.(data);
        if (autoRevalidateRef.current) {
          revalidatorRef.current.revalidate();
        }
      });

      eventSource.addEventListener("request_complete", (e) => {
        const data = JSON.parse(e.data);
        console.log("[SSE] Received request_complete event", data);
        setState((prev) => ({ ...prev, lastEventTime: Date.now() }));
        optionsRef.current.onRequestComplete?.(data);
        if (autoRevalidateRef.current) {
          revalidatorRef.current.revalidate();
        }
      });

      eventSource.addEventListener("heartbeat", () => {
        setState((prev) => ({ ...prev, lastEventTime: Date.now() }));
      });
    };

    connect();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !eventSourceRef.current) {
        connect();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []); // Empty deps - only run once on mount

  return {
    ...state,
  };
}
