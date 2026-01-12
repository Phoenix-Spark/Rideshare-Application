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
import {
  broadcastNewRequest,
  broadcastRequestAccepted,
  broadcastRequestCancelled,
  broadcastRequestPickup,
  broadcastRequestComplete,
  broadcastCancelAcceptedRide,
} from "server/events/requestEvents.server";
import { prisma } from "server/db.server";
import { useSSE } from "~/hooks/useSSE";

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
    const newRequest = await createRequest(userId!, baseId!, pickupId!, dropoffId!);
    await broadcastNewRequest(newRequest.id, baseId!);
    return {success: true, message: "Ride requested!"}
  }
  if (intent === "cancelRequest") {
    const req = await prisma.request.findUnique({
      where: { id: requestId },
      select: { baseId: true, userId: true, driverId: true },
    });
    await cancelRequest(requestId!, driverId!);
    if (req) {
      await broadcastRequestCancelled(
        requestId!,
        req.baseId,
        req.userId,
        req.driverId,
        "passenger"
      );
    }
    return {success: true, message: "Ride cancelled!"}
  }
  if (intent === "acceptRequest") {
    const req = await prisma.request.findUnique({
      where: { id: requestId },
      select: { baseId: true, userId: true },
    });
    await acceptRequest(requestId!, driverId!, userId!);
    if (req?.baseId && req?.userId) {
      await broadcastRequestAccepted(requestId!, req.baseId, req.userId, driverId!);
    }
    return {success: true, message: "Accepted ride!"}
  }
  if (intent === "pickupRequest") {
    const req = await prisma.request.findUnique({
      where: { id: requestId },
      select: { baseId: true, userId: true },
    });
    if(rideConfirmOrCancel === "confirm"){
      await pickupRequest(requestId!, userId!);
      if (req?.userId) {
        broadcastRequestPickup(requestId!, req.userId);
      }
      return {success: true, message: "Picked up passenger!"}
    } else{
      await cancelAcceptedRide(requestId!, userId!, pickupId!);
      if (req?.baseId && req?.userId) {
        await broadcastCancelAcceptedRide(requestId!, req.baseId, req.userId);
      }
      return {success: true, message: ""}
    }
  }
  if (intent === "dropOffRequest") {
    const req = await prisma.request.findUnique({
      where: { id: requestId },
      select: { userId: true },
    });
    await dropOffRequest(requestId!, userId!);
    if (req?.userId) {
      broadcastRequestComplete(requestId!, req.userId);
    }
    return {success: true, message: "Ride completed!"}
  }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { user, station, accepted, activeRequests, vehicles, requestInfo, bases } = loaderData;

  useSSE({
    onNewRequest: (data) => {
      console.log('data: ', data.request)
      const { id } = data?.request.user
      if(user?.id === id){
        toast.success('Your ride request was created!');
      }
    },
    onRenewRequest: (data) => {
      const {id} = data?.request.user;
      if(id === user?.id){
        toast.info('Your ride was cancelled by the driver, and was recreated!');
      }
    },
    onRequestCancelled: (data) => {
      console.log('data: ', data)
     
      if(data?.userId === user?.id){
        toast.info("Your request was successfully cancelled!")
      }
    },
    onRequestAccepted: (data) => {
      console.log("[Dashboard] onRequestAccepted called", data);
      const { driver } = data as { driver?: { firstName: string; lastName: string } };
      setTimeout(() => {
        if (driver) {
          toast.success(`Your ride was accepted by ${driver.firstName} ${driver.lastName}!`);
        } 
        // else {
        //   toast.info("Your ride was accepted!");
        // }
      }, 0);
    },
    // onRequestCancelled: (data) => {
    //   console.log("[Dashboard] onRequestCancelled called", data);
    //   setTimeout(() => toast.warning("A ride request was cancelled."), 0);
    // },
    onRequestPickup: (data) => {
      console.log("[Dashboard] onRequestPickup called", data);
      setTimeout(() => toast.info("Your driver has arrived!"), 0);
    },
    onRequestComplete: (data) => {
      console.log("[Dashboard] onRequestComplete called", data);
      setTimeout(() => toast.success("Ride completed. Thank you!"), 0);
    },
    autoRevalidate: true,
  });

  return (
    <div>
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