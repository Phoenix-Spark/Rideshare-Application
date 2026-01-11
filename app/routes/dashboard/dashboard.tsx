import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
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
import { getUserInfo, updateUserInfo } from "server/queries/user.queries.server";
import { checkEmailVerification, requireSameOrigin, requireUserId } from "server/session.server";
import DashboardForm from "~/components/Forms/DashboardForm";
import MapDisplay from "~/components/Maps/MapDisplay";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";
import type { Route } from "./+types/dashboard";
import { getVehicles } from "server/queries/vehicle.queries.server";
import { getBase } from "server/queries/base.queries.server";
import { CSRFError } from "remix-utils/csrf/server";
import { csrf } from "server/csrf.server";
import { useRequestSSE } from "~/hooks/useRequests";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const user = await getUserInfo("dashboard", userId);
  const verified = await checkEmailVerification(userId, request);
  const station = await getStop(user?.base?.id);
  const passenger = await getPassengerRequest(userId);
  const accepted = await getDriverRequest(userId);
  const vehicles = await getVehicles(userId);
  const activeRequests = await getActiveRequest(user?.base?.id);
  const bases = await getBase();

  return { user, verified, station, accepted, activeRequests, vehicles, requestInfo: passenger, bases };
}

export async function action({ request }: ActionFunctionArgs) {
  requireSameOrigin(request);
  try {
    await csrf.validate(request);
  } catch (error) {
    if (error instanceof CSRFError) {
      return { success: false, message: "Invalid Security Token" }
    }
    return { success: false, message: error }
  }

  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const requestId = (formData.get("requestId") as string) || undefined;
  const driverId = (formData.get("driverId") as string) || undefined;
  const userId = (formData.get("userId") as string) || undefined;
  const baseId = (formData.get("baseId") as string) || undefined;
  const pickupId = (formData.get("pickupId") as string) || undefined;
  const dropoffId = (formData.get("dropoffId") as string) || undefined;
  const rideConfirmOrCancel = (formData.get("submit") as string) || undefined
  if (intent === "initialSetup") {
    updateUserInfo(userId!, { baseId })
    return { success: true, message: "Base updated!" }
  }
  if (intent === "createRequest") {
    createRequest(userId!, baseId!, pickupId!, dropoffId!);
    return { success: true, message: "Ride requested!" }
  }
  if (intent === "cancelRequest") {
    cancelRequest(requestId!, driverId!);
    return { success: true, message: "Ride cancelled!" }
  }
  if (intent === "acceptRequest") {
    acceptRequest(requestId!, driverId!, userId!);
    return { success: true, message: "Accepted ride!" }
  }
  if (intent === "pickupRequest") {
    if (rideConfirmOrCancel === "confirm") {
      pickupRequest(requestId!, userId!);
      return { success: true, message: "Picked up passenger!" }
    } else {
      cancelAcceptedRide(requestId!, userId!, pickupId!);
      return { success: true, message: "" }
    }
  }
  if (intent === "dropOffRequest") {
    dropOffRequest(requestId!, userId!);
    return { success: true, message: "Ride completed!" }
  }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { user, station, accepted, activeRequests, vehicles, requestInfo, bases } = loaderData;

  const { isConnected } = useRequestSSE({
    onNewRequest: (request: any) => {
      toast.success(`New ride request from ${request.user.firstName}!`, {
        position: "top-right",
        autoClose: 5000,
      });

      try {
        new Audio("/notification.mp3").play();
      } catch (e) {
        console.log("Could not play notification sound");
      }
    },
  });

  return (
    <div>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div
          className={`px-3 py-2 rounded-full text-sm flex items-center gap-2
          ${isConnected
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
            }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
          />
          {isConnected ? "Live" : "Offline"}
        </div>
      </div>

      <MapDisplay user={user} station={station} />
      <DashboardForm
        user={user}
        station={station}
        accepted={accepted}
        vehicles={vehicles}
        activeRequests={activeRequests}
        requestInfo={requestInfo}
        bases={bases}
      />
    </div>
  );
}

export { ErrorBoundary };