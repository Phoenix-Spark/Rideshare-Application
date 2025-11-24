// app/hooks/useRideNotifications.ts (driver side)
import { useEffect, useRef } from "react";
import { useWebSocket } from "./useWebSocket";
import { useFetcher } from "react-router";

export function useRideNotifications(userId: string | null) {
  const { messages } = useWebSocket(userId);
  const fetcher = useFetcher();
  const processedMessageIds = useRef(new Set<string>());

  useEffect(() => {
    // Find ALL unprocessed new ride notifications (use filter, not find)
    const newRideMessages = messages.filter(
      m => m.type === "new_ride_request" && !processedMessageIds.current.has(m.rideId)
    );

    const acceptedMessages = messages.filter(m => m.type === 'accept_ride_request' && !processedMessageIds.current.has(m.rideId));

    const cancelMessages = messages.filter(m => m.type === 'user_cancelled_request' && !processedMessageIds.current.has(m.rideId));

    const pickedUpMessages = messages.filter(m => m.type === 'user_picked_up' && !processedMessageIds.current.has(m.rideId));
    
    const droppedOffMessages = messages.filter(m => m.type === 'user_dropped_off' && !processedMessageIds.current.has(m.rideId));
    
    console.log('newRideMessages: ', newRideMessages);
    console.log('accepted', messages)
    
    if (newRideMessages.length > 0) {
      // Mark these as processed
      newRideMessages.forEach(msg => {
        processedMessageIds.current.add(msg.rideId);
      });
      
      // Fetch the latest ride requests from DB
      fetcher.load("/available");
      
      // Optional: Show notification
      if (Notification.permission === "granted") {
        newRideMessages.forEach(() => {
          new Notification("New Ride Request!", {
            body: "A new ride is available nearby"
          });
        });
      }
    }

    if( acceptedMessages.length > 0){
      acceptedMessages.forEach(msg => {
        processedMessageIds.current.add(msg.rideId);
      });

      fetcher.load(`/requests`);

    }

    if(cancelMessages.length > 0){
      cancelMessages.forEach(msg => {
        processedMessageIds.current.add(msg.rideId);
      });
      fetcher.load("/available")
    }

    if(pickedUpMessages.length > 0){
      pickedUpMessages.forEach(msg => {
        processedMessageIds.current.add(msg.rideId);
      })
    }

    if(droppedOffMessages.length > 0){
      droppedOffMessages.forEach(msg => {
        processedMessageIds.current.add(msg.rideId);
      })
    }
  }, [messages, fetcher]);

  return { rideData: fetcher.data };
}