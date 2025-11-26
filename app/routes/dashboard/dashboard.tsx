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
} from "server/queries/request.queries.server";
import { getStop } from "server/queries/station.queries.server";
import { getUserInfo } from "server/queries/user.queries.server";
import { requireUserId } from "server/session.server";
import DashboardForm from "~/components/Forms/DashboardForm";
import MapDisplay from "~/components/Maps/MapDisplay";
import { useRideNotifications } from "~/hooks/useRideNotifications";
import { useWebSocket } from "~/hooks/useWebSocket";
import type { Route } from "../../+types/root";

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
  if (intent === "createRequest") {
    createRequest(userId!, baseId!, pickupId!, dropoffId!);
    return { success: true, message: "Ride Requested!"}
  }
  if (intent === "cancelRequest") {
    cancelRequest(requestId!, driverId!);
    return { success: false, message: "Ride Cancelled!"}
  }
  if (intent === "acceptRequest") {
    acceptRequest(requestId!, driverId! , userId!);
  }
  if (intent === "pickupRequest") {
    pickupRequest(requestId!, userId!);
  }
  if (intent === "dropOffRequest") {
    dropOffRequest(requestId!, userId!);
  }
}

export default function Dashboard({ loaderData, actionData }: Route.ComponentProps) {
  const { user, station, accepted, activeRequests, requestInfo } =
  loaderData;

const revalidate = useRevalidator();
const { isConnected, messages, sendMessage } = useWebSocket(user?.id);
const { rideData } = useRideNotifications(user?.id);
const processedRideIds = useRef(new Set<string>());
const processedAcceptedRides = useRef(new Set<string>());
const processedCancelledRides = useRef(new Set<string>());
const processedPickedUpRides = useRef(new Set<string>());
const processedDroppedOffRides = useRef(new Set<string>());
const processedRideAcceptedRides = useRef(new Set<string>());

useEffect(() => {
  console.log('messages: ', messages)
  const newRideMessages = messages.filter(
    m => m.type === "new_ride_request" && !processedRideIds.current.has(m.rideId)
  );
  
  const acceptMessages = messages.filter(
    m => m.type === "accept_ride_request" && !processedAcceptedRides.current.has(m.rideId)
  );
  
  const cancelledMessages = messages.filter(
    m => m.type === "user_cancelled_request" && !processedCancelledRides.current.has(m.rideId)
  );

  const pickedUpMessages = messages.filter(
    m => m.type === "user_picked_up" && !processedPickedUpRides.current.has(m.rideId)
  );

  const droppedOffMessages = messages.filter(
    m => m.type === "user_dropped_off" && !processedDroppedOffRides.current.has(m.rideId)
  );
  const rideAcceptedMessages = messages.filter(
    m => m.type === "ride_accepted" && !processedRideAcceptedRides.current.has(m.rideId)
  );
  
  if (newRideMessages.length > 0 && rideData) {
    newRideMessages.forEach(m => processedRideIds.current.add(m.rideId));
    revalidate.revalidate();
  }
  
  if (acceptMessages.length > 0) {
    acceptMessages.forEach(m => processedAcceptedRides.current.add(m.rideId));
    revalidate.revalidate();
  }

  if( cancelledMessages.length > 0){
    cancelledMessages.forEach(m => processedCancelledRides.current.add(m.rideId));
    revalidate.revalidate();
  }
  if( pickedUpMessages.length > 0){
    pickedUpMessages.forEach(m => processedPickedUpRides.current.add(m.rideId));
    revalidate.revalidate();
  }
  if( droppedOffMessages.length > 0){
    droppedOffMessages.forEach(m => processedDroppedOffRides.current.add(m.rideId));
    revalidate.revalidate();
  }
  if( rideAcceptedMessages.length > 0){
    rideAcceptedMessages.forEach(m => processedRideAcceptedRides.current.add(m.rideId));
    revalidate.revalidate();
  }
}, [messages, rideData, revalidate]);

useEffect(() => {
  if(actionData?.success){
    toast.success(actionData.message)
  }
  if(actionData && !actionData?.success){
    toast.error(actionData.message)
  }
},[actionData])

  return (
    <div>
      <MapDisplay
        user={user} 
        station={station} 
      />
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
