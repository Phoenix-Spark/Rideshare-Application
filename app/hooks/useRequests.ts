import { useEffect, useRef } from "react";
import { useRevalidator } from "react-router";

export function useRequestSSE({ onNewRequest }: any) {
  const revalidator = useRevalidator();
  const eventSourceRef = useRef<EventSource | null>(null);
  const onNewRequestRef = useRef(onNewRequest);
  const revalidatorRef = useRef(revalidator);

  useEffect(() => {
    onNewRequestRef.current = onNewRequest;
    revalidatorRef.current = revalidator;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      return;
    }

    const eventSource = new EventSource("/api/sse");
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "NEW_REQUEST") {
        onNewRequestRef.current?.(data.request);
        revalidatorRef.current.revalidate();
      }
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, []);
}
