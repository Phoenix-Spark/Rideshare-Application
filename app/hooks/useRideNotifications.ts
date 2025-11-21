// app/hooks/useRideNotifications.ts (driver side)
import { useEffect } from "react";
import { useWebSocket } from "./useWebSocket";
import { useFetcher } from "react-router";

export function useRideNotifications(userId: string | null) {
  const { messages } = useWebSocket(userId);
  const fetcher = useFetcher();

  useEffect(() => {
    // Listen for new ride notifications
    const newRideMessage = messages.find(m => m.type === "new_ride_request");
    
    if (newRideMessage) {
      // Fetch the latest ride requests from DB
      fetcher.load(`available`);
      
      // Optional: Show notification
      if (Notification.permission === "granted") {
        new Notification("New Ride Request!", {
          body: "A new ride is available nearby"
        });
      }
    }
  }, [messages]);

  return { rideData: fetcher.data };
}