import { useEffect, useRef } from "react";
import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  useRevalidator,
} from "react-router";
import { toast } from "react-toastify";
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
  }
  if (intent === "cancelRequest") {
    cancelRequest(requestId!, driverId!);
  }
  if (intent === "acceptRequest") {
    acceptRequest(requestId!, driverId! , userId!);
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

  const { messages } = useWebSocket(user?.id);
  const previousMessagesRef = useRef<RideMessage[]>([]);
  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.message);
    }
    if (actionData && !actionData?.success) {
      toast.error(actionData.message);
    }
  }, [actionData]);

  useEffect(() => {
    console.log(messages)
    messages.forEach(message => {
      const previous = previousMessagesRef.current.find(m => m.rideId === message.rideId);
      if (previous?.status !== message.status) {
        if (message.status === "accepted") {
          toast.success("Ride accepted!");
        }
        if (message.status === "picked_up") {
          toast.info("Passenger picked up!");
        }
        if (message.status === "completed") {
          toast.success("Ride completed!");
        }
        if (message.status === "cancelled") {
          toast.info("Ride request cancelled!")
        }
      }
    });
    revalidate.revalidate();
    previousMessagesRef.current = messages;
  }, [messages]);

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