import { type LoaderFunctionArgs, type ActionFunctionArgs, useLoaderData } from "react-router";
import { registerUser } from "server/queries/auth.queries.server";
import { createBase, deleteBase, getBase, updateBase } from "server/queries/base.queries.server";
import { createStop, deleteStop, getStop, updateStop } from "server/queries/station.queries.server";
import { deleteUserAccount, getAccounts, getUserInfo, updateUserInfoAdmin } from "server/queries/user.queries.server";
import { requireAdminId, requireUserId } from "server/session.server";
import AdminSettingsModal from "~/components/Modals/AdminSettingsModal";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId   = await requireUserId(request);
  const user     = await getUserInfo('admin', userId);
  const base     = await getBase();
  const station  = await getStop(user?.baseId);
  const accounts = await getAccounts();

  return { user, base, station, accounts };
}

export async function action({ request }: ActionFunctionArgs) {
  const loggedinUserId = await requireUserId(request);
  await requireAdminId(loggedinUserId)

  const formData      = await request.formData();
  const intent        = formData.get("intent") as string;

  const baseId        = formData.get("baseId") as string || undefined;
  const id            = formData.get("id") as string || undefined;
  const name          = formData.get("name") as string || undefined;
  const state         = formData.get("state") as string || undefined;
  const longitude     = formData.get("longitude") as string || undefined;
  const latitude      = formData.get("latitude") as string || undefined;
  const description   = formData.get("description") as string || undefined;

  const userId        = formData.get("userId") as string;
  const inviteCode    = formData.get("inviteCode") as string || undefined;
  const firstName     = formData.get("firstName") as string || undefined;
  const lastName      = formData.get("lastName") as string || undefined;
  const email         = formData.get("email") as string || undefined;
  const phoneNumber   = formData.get("phoneNumber") as string || undefined;
  const password      = formData.get("password") as string || undefined;
  const isAdmin       = formData.get("isAdmin") === "true";
  const isDriver      = formData.get("isDriver") === "true";
  const isPassenger   = formData.get("isPassenger") === "true";
  const isReset       = formData.get("isReset") === "true";
  
  if (intent === "createBase") {
    return createBase(name!, state!, longitude!, latitude!);
  } 
  if (intent === "updateBase") {
    return updateBase(id!, name!, state!, longitude!, latitude!);
  } 
  if (intent === "deleteBase") {
    return deleteBase(id!)
  }
  if (intent === "createStop") {
    return createStop(baseId!, name!, longitude!, latitude!, description!)
  }
  if (intent === "updateStop") {
    return updateStop(id!, baseId!, name!, longitude!, latitude!, description!)
  }
  if (intent === "deleteStop") {
    return deleteStop(id!)
  }
  if (intent === "createUser") {
    return registerUser(inviteCode!, firstName!, lastName!, email!, phoneNumber!, password!)
  }
  if (intent === "updateUser") {
    return updateUserInfoAdmin({ userId, firstName, lastName, email, phoneNumber, isAdmin, isDriver, isPassenger, isReset })
  }
  if (intent === "deleteUser") {
    return deleteUserAccount(userId)
  }
}

export default function AdminSettings() {
    
    const { user, base, station, accounts } = useLoaderData<typeof loader>();
    return <AdminSettingsModal user={user} base={base} station={station} accounts={accounts} />
}