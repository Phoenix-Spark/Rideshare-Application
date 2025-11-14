import {
  useLoaderData,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router";
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

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const user = await getUserInfo("dashboard", userId);
  console.log(user)
  const station = await getStop(user?.baseId || "");
  const passenger = await getPassengerRequest(userId);
  const accepted = await getDriverRequest(userId);
  const activeRequests = await getActiveRequest(user?.baseId);

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
  }
  if (intent === "dropOffRequest") {
    dropOffRequest(requestId!);
  }
}

export default function Dashboard() {
  const { user, station, accepted, activeRequests, requestInfo } = useLoaderData<typeof loader>();
  return (
    <div>
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
