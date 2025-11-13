import {
  useLoaderData,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router";
import { cancelRequest, createRequest, getUserRequest } from "server/queries/request.queries.server";
import { getStop } from "server/queries/station.queries.server";
import { getUserInfo } from "server/queries/user.queries.server";
import { requireUserId } from "server/session.server";
import DashboardForm from "~/components/Forms/DashboardForm";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const user = await getUserInfo("dashboard", userId);
  const station = await getStop(user?.baseId || '');
  const requestInfo = await getUserRequest(userId);

  return { user, station, requestInfo };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const requestId = formData.get("requestId") as string || undefined;
  const userId = formData.get("userId") as string || undefined;
  const pickupId = formData.get("pickupId") as string || undefined;
  const dropoffId = formData.get("dropoffId") as string || undefined;

  if (intent === "requestPickup") {
    createRequest(userId!, pickupId!, dropoffId!)
  }
  if (intent === "requestDelete") {
    cancelRequest(requestId!)
  }
}

export default function Dashboard() {
  const { user, station, requestInfo } = useLoaderData<typeof loader>();
  return <DashboardForm user={user} station={station} requestInfo={requestInfo}/>;
}
