import { useLoaderData, type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import { deleteUserAccount, getBaseInfo, getUserInfo, updateUserInfo } from "server/queries/user.queries.server";
import { createVehicle, deleteVehicle, getVehicles } from "server/queries/vehicle.queries.server";
import { requireUserId } from "server/session.server";
import UserSettingsModal from "~/components/Modals/UserSettingsModal";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const user = await getUserInfo('settings', userId);
  const vehicles = await getVehicles(userId);
  const base = await getBaseInfo();
  
  return{ user, base, vehicles };
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent      = formData.get("intent") as string;

  const firstName   = formData.get("firstName") as string || undefined;
  const lastName    = formData.get("lastName") as string || undefined;
  const email       = formData.get("email") as string || undefined;
  const password    = formData.get("password") as string || undefined;
  const phoneNumber = formData.get("phoneNumber") as string || undefined;
  const baseId      = formData.get("baseId") as string || undefined;
  const isDriver    = formData.get("isDriver") === "true";

  const id          = formData.get("id") as string || undefined;
  const year        = formData.get("year") as string || undefined;
  const make        = formData.get("make") as string || undefined;
  const model       = formData.get("model") as string || undefined;
  const color       = formData.get("color") as string || undefined;
  const plate       = (formData.get("plate") as string | null)?.toUpperCase() || undefined;

  if (intent === "user") {
    return updateUserInfo(userId, firstName, lastName, email, phoneNumber, password, baseId, isDriver);
  }
  if (intent === "user-delete") {
    return deleteUserAccount(userId)
  }
  if (intent === "vehicle") {
    return createVehicle(userId, year!, make!, model!, color!, plate!)
  }
  if (intent === "vehicle-delete") {
    return deleteVehicle(id!)
  }
}

export default function UserSettings() {
    const { user, base, vehicles } = useLoaderData<typeof loader>();
    return <UserSettingsModal user={user} base={base} vehicles={vehicles} />
}