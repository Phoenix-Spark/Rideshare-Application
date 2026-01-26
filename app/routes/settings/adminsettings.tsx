import { useEffect } from "react";
import { type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import { toast } from "react-toastify";
import { registerUser } from "server/queries/auth.queries.server";
import { createBase, deleteBase, getBase, updateBase } from "server/queries/base.queries.server";
import { createStop, deleteStop, getStop, updateStop } from "server/queries/station.queries.server";
import { getAccounts, getUserInfo, updateUserInfoAdmin } from "server/queries/user.queries.server";
import { checkEmailVerification, requireAdminId, requireSameOrigin, requireUserId } from "server/session.server";
import AdminSettingsModal from "~/components/Modals/AdminSettingsModal";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";
import type { Route } from "./+types/adminsettings";
import { CSRFError } from "remix-utils/csrf/server";
import { csrf } from "server/csrf.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId   = await requireUserId(request);
  await checkEmailVerification(userId, request)
  const user     = await getUserInfo('admin', userId);
  const base     = await getBase();

  const searchParams = new URL(request.url).searchParams;
  const selectedBase = searchParams.get("selectedBase");
  let station: { name: string; id: string; baseId: string; base: { name: string; }; longitude: string; latitude: string; description: string | null; }[] = []
  if(selectedBase) {
    station  = await getStop(atob(selectedBase));
  }
  const accounts = await getAccounts();

  return { user, base, station, accounts };
}

export async function action({ request }: ActionFunctionArgs) {
  requireSameOrigin(request);
  try {
    await csrf.validate(request);
  } catch (error) {
    if (error instanceof CSRFError) {
      return {success: false, message: "Invalid Security Token"}
    }
    return {success: false, message: error}
  }

  const loggedinUserId = await requireUserId(request);
  await requireAdminId(loggedinUserId)

  const formData      = await request.formData();
  const intent        = formData.get("intent") as string;

  const baseId        = formData.get("baseId") as string;
  const id            = formData.get("id") as string;
  const name          = formData.get("name") as string;
  const state         = formData.get("state") as string;
  const longitude     = formData.get("longitude") as string;
  const latitude      = formData.get("latitude") as string;
  const description   = formData.get("description") as string;

  const userId        = formData.get("userId") as string;
  const inviteCode    = formData.get("inviteCode") as string;
  const firstName     = formData.get("firstName") as string;
  const lastName      = formData.get("lastName") as string;
  const email         = formData.get("email") as string;
  const phoneNumber   = formData.get("phoneNumber") as string;
  const password      = formData.get("password") as string;
  const isAdmin       = formData.get("isAdmin") === "true";
  const isDriver      = formData.get("isDriver") === "true";
  const isPassenger   = formData.get("isPassenger") === "true";
  const isReset       = formData.get("isReset") === "true";
  try{

    if (intent === "createBase") {
      await createBase(name, state, longitude, latitude);
      return { success: true, message: "Base created!", intent}
    } 
    if (intent === "updateBase") {
      await updateBase(id, name, state, longitude, latitude);
      return { success: true, message: "Base updated!", intent} 
    } 
    if (intent === "deleteBase") {
      await deleteBase(id)
      return { success: true, message: "Base deleted!", intent} 
    }
    if (intent === "createStop") {
      return await createStop(baseId, name, longitude, latitude, description)
      // return { success: true, message: "New stop added!", intent} 
    }
    if (intent === "updateStop") {
      await updateStop(id, baseId, name, longitude, latitude, description)
      return { success: true, message: "Stop updated!", intent} 
    }
    if (intent === "deleteStop") {
      await deleteStop(id)
      return { success: true, message: "Stop deleted!", intent} 
    }
    if (intent === "createUser") {
      const result = await registerUser(inviteCode, firstName, lastName, email, phoneNumber, password, baseId)
      if (result && 'error' in result) {
        return { success: false, message: result.error }
      }
      return { success: true, message: "User created!", intent}
  }
  if (intent === "updateUser") {
    await updateUserInfoAdmin( userId, {firstName, lastName, email, phoneNumber, isAdmin, isDriver, isPassenger, isReset })
    return { success: true, message: "User updated!", intent}
  }
  // if (intent === "deleteUser") {
  //   await deleteUserAccount(userId)
  //   return { success: true, message: "User deleted!", intent}
  // }
  }catch(error){
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, message }
  }
}

export default function AdminSettings({ loaderData, actionData}: Route.ComponentProps) {
    
  const { user, base, accounts, station } = loaderData;
  useEffect(() => {
    if (!actionData) return;

    if ('success' in actionData && 'message' in actionData) {
      if (actionData.success) {
        toast.success(actionData.message as string);
      } else {
        toast.error("Uh oh, an error occured.");
      }
    }
  }, [actionData]);

    return <AdminSettingsModal user={user} base={base} station={station} accounts={accounts} actionData={actionData}/>
}

export { ErrorBoundary };