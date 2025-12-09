import { useEffect, useRef } from "react";
import {
  useLoaderData,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  useRevalidator,
} from "react-router";
import { toast } from "react-toastify";
// import { notifyDriversOfNewRide } from "server";
import {
  cancelRequest,
  createRequest,
  getPassengerRequest,
  getDriverRequest,
  getActiveRequest,
  acceptRequest,
  pickupRequest,
  dropOffRequest,
  cancelAcceptedRide,
} from "server/queries/request.queries.server";
import { getStop } from "server/queries/station.queries.server";
import { getUserInfo } from "server/queries/user.queries.server";
import { requireUserId } from "server/session.server";
import DashboardForm from "~/components/Forms/DashboardForm";
import MapDisplay from "~/components/Maps/MapDisplay";
import { useRideNotifications } from "~/hooks/useRideNotifications";
import { useWebSocket, type RideMessage } from "~/hooks/useWebSocket";
import type { Route } from "../../+types/root";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const user = await getUserInfo("dashboard", userId);
  const station = await getStop(user?.base?.id);
  const passenger = await getPassengerRequest(userId);
  const accepted = await getDriverRequest(userId);
  const activeRequests = await getActiveRequest(user?.base?.id);

  return { user, station, accepted, activeRequests, requestInfo: passenger };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const requestId = (formData.get("requestId") as string) || undefined;
  const driverId = (formData.get("driverId") as string) || undefined;
  const userId = (formData.get("userId") as string) || undefined;
  const baseId = (formData.get("baseId") as string) || undefined;
  const pickupId = (formData.get("pickupId") as string) || undefined;
  const dropoffId = (formData.get("dropoffId") as string) || undefined;
  const rideConfirmOrCancel = (formData.get("submit") as string) || undefined

  if (intent === "createRequest") {
    createRequest(userId!, baseId!, pickupId!, dropoffId!);
    // return { success: true, message: "Ride Requested!"}
  }
  if (intent === "cancelRequest") {
    cancelRequest(requestId!, driverId!);
    // return { success: false, message: "Ride Cancelled!"}
  }
  if (intent === "acceptRequest") {
    acceptRequest(requestId!, driverId! , userId!);
    // return { success: true, message: "Ride Accepted!!"}
  }
  if (intent === "pickupRequest") {
    if(rideConfirmOrCancel === "confirm")   
      pickupRequest(requestId!, userId!);
    else
      cancelAcceptedRide(requestId!, userId!, pickupId!);
  }
  if (intent === "dropOffRequest") {
    dropOffRequest(requestId!, userId!);
  }
}

export default function Dashboard({ loaderData, actionData }: Route.ComponentProps) {
  const { user, station, accepted, activeRequests, requestInfo } = loaderData;

  const revalidate = useRevalidator();
  const { isConnected, messages, sendMessage } = useWebSocket(user?.id);
  const { rideData } = useRideNotifications(user?.id);
  
  // Track which messages we've already processed
  // const lastProcessedIndex = useRef(0);
  // const processedAcceptedRides = useRef(new Set<string>());
  const previousMessagesRef = useRef<RideMessage[]>([]);

  // useEffect(() => {
  //   if (!messages || messages.length === 0) return;

  //   // Check if messages changed
  //   const hasChanged = JSON.stringify(messages) !== JSON.stringify(previousMessagesRef.current);
    
  //   if (hasChanged) {
  //     console.log("📊 Active rides:", messages.length);
  //     messages.forEach(msg => {
  //       console.log(`  - Ride ${msg.rideId}: ${msg.status}`);
  //     });

  //     previousMessagesRef.current = messages;
  //     revalidate.revalidate();
  //   }
  // }, [messages, revalidate]);

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.message);
    }
    if (actionData && !actionData?.success) {
      toast.error(actionData.message);
    }
  }, [actionData]);

  useEffect(() => {
    messages.forEach(message => {
      const previous = previousMessagesRef.current.find(m => m.rideId === message.rideId);
      console.log('previous', previous)
      if (!previous) {
        // New ride appeared
        if (message.status === "requested") {
          toast.info("New ride request!");
        }
      } else if (previous.status !== message.status) {
        // Status changed
        if (message.status === "accepted") {
          toast.success("Ride accepted!");
        }
        if (message.status === "picked_up") {
          toast.info("Passenger picked up!");
        }
        if (message.status === "completed") {
          toast.success("Ride completed!");
        }
      } else {
        toast.info("no change")
      }
    });
    
    previousMessagesRef.current = messages;
  }, [messages]);
  console.log(messages)
  // You can now easily access ride status
  const myActiveRide = messages.find(m => m.userId === user?.id);
  const myAcceptedRide = messages.find(m => m.driverId === user?.id && m.status === "accepted");


  return (
    <div>
      <MapDisplay user={user} station={station} />
      <DashboardForm
        user={user}
        station={station}
        accepted={accepted}
        activeRequests={activeRequests}
        requestInfo={requestInfo}
      />
    </div>
  );
}

export { ErrorBoundary };