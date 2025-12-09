import { useEffect } from "react";
import { type LoaderFunctionArgs, type ActionFunctionArgs, useLoaderData } from "react-router";
import { toast } from "react-toastify";
import { registerUser } from "server/queries/auth.queries.server";
import { createBase, deleteBase, getBase, updateBase } from "server/queries/base.queries.server";
import { createStop, deleteStop, getStop, updateStop } from "server/queries/station.queries.server";
import { deleteUserAccount, getAccounts, getUserInfo, updateUserInfoAdmin } from "server/queries/user.queries.server";
import { requireAdminId, requireUserId } from "server/session.server";
import AdminSettingsModal from "~/components/Modals/AdminSettingsModal";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";
import type { Route } from "./+types/adminsettings";

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
    createBase(name!, state!, longitude!, latitude!);
    return { success: true, message: "Base created!", intent}
  } 
  if (intent === "updateBase") {
    updateBase(id!, name!, state!, longitude!, latitude!);
    return { success: true, message: "Base updated!", intent} 
  } 
  if (intent === "deleteBase") {
    deleteBase(id!)
    return { success: true, message: "Base deleted!", intent} 
  }
  if (intent === "createStop") {
    createStop(baseId!, name!, longitude!, latitude!, description!)
    return { success: true, message: "New stop added!", intent} 
  }
  if (intent === "updateStop") {
    updateStop(id!, baseId!, name!, longitude!, latitude!, description!)
    return { success: true, message: "Stop updated!", intent} 
  }
  if (intent === "deleteStop") {
    deleteStop(id!)
    return { success: true, message: "Stop deleted!", intent} 
  }
  if (intent === "createUser") {
    registerUser(inviteCode!, firstName!, lastName!, email!, phoneNumber!, password!)
    return { success: true, message: "User created!", intent}
  }
  if (intent === "updateUser") {
    updateUserInfoAdmin({ userId, firstName, lastName, email, phoneNumber, isAdmin, isDriver, isPassenger, isReset })
    return { success: true, message: "User updated", intent}
  }
  if (intent === "deleteUser") {
    deleteUserAccount(userId)
    return { success: true, message: "User deleted!", intent}
  }
}

export default function AdminSettings({ loaderData, actionData}: Route.ComponentProps) {
    
    const { user, base, station, accounts } = loaderData;
    useEffect(() => {
      if(actionData?.success && actionData?.message){
        toast.success(actionData.message);
      }
    },[actionData]);

    return <AdminSettingsModal user={user} base={base} station={station} accounts={accounts} />
}

export { ErrorBoundary };