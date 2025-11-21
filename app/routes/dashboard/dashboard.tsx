import { useEffect } from "react";
import {
  useLoaderData,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  useRevalidator,
} from "react-router";
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

  if (intent === "requestPickup") {
    createRequest(userId!, baseId!, pickupId!, dropoffId!);
  }
  if (intent === "cancelRequest") {
    cancelRequest(requestId!);
  }
  if (intent === "acceptRequest") {
    acceptRequest(requestId!, driverId!);
  }
  if (intent === "pickupRequest") {
    pickupRequest(requestId!);
    // notifyDriversOfNewRide(requestId!, pickupId!)
  }
  if (intent === "dropOffRequest") {
    dropOffRequest(requestId!);
  }
}

export default function Dashboard() {
  const { user, station, accepted, activeRequests, requestInfo } =
    useLoaderData<typeof loader>();
  
  const revalidate = useRevalidator();

  const {isConnected, messages, sendMessage} = useWebSocket(user?.id)
  const { rideData } = useRideNotifications(user?.id);


  useEffect(() => {
      if(rideData){
        revalidate.revalidate()
      }
  }, [rideData])

  return (
    <div>
      <div className="absolute bg-red-500 z-60">
        <div>Status: {isConnected ? 'Connected': 'Disconnected'}</div>
        <button className="hover:bg-red-300" onClick={() => {console.log('sent'); sendMessage({ type: 'ping'})}} >Send Message</button>
        <div>Messages:
          {messages && messages.length > 0 && <>{messages.map(message =><p>{message.type}: {message.timestamp}</p>)}</>}
        </div>
      </div>
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
