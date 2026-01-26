import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router";
import { CSRFError } from "remix-utils/csrf/server";
import { csrf } from "server/csrf.server";
import {
  createInvite,
  deleteInvite,
  disableInvite,
  enableInvite,
  getInvites,
  updateInvite,
} from "server/queries/invite.queries.server";
import {
  deleteUserAccount,
  getBaseInfo,
  getUserBase,
  getUserInfo,
  updateUserInfo,
} from "server/queries/user.queries.server";
import {
  createVehicle,
  deleteVehicle,
  enableVehicle,
  getVehicles,
} from "server/queries/vehicle.queries.server";
import {
  checkEmailVerification,
  requireSameOrigin,
  requireUserId,
} from "server/session.server";
import UserSettingsModal from "~/components/Modals/UserSettingsModal";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";
import type { Route } from "./+types/usersettings";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { sendInvitationEmail } from "server/queries/verify.queries.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  await checkEmailVerification(userId, request);
  const user = await getUserInfo("settings", userId);
  const vehicles = await getVehicles(userId);
  const base = await getBaseInfo();
  const userBase = await getUserBase(userId);
  const invite = await getInvites(userId);

  return { user, base, userBase, vehicles, invite };
}

export async function action({ request }: ActionFunctionArgs) {
  requireSameOrigin(request);
  try {
    await csrf.validate(request);
  } catch (error) {
    if (error instanceof CSRFError) {
      return {success: false, message: "Invalid Security Token"}
    }
    return {success: false, message: "An Error Occured"}
  }

  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const baseId = formData.get("baseId") as string;

  const isDriver = formData.get("isDriver") === "true";
  const id = formData.get("id") as string ;
  const year = formData.get("year") as string ;
  const make = formData.get("make") as string ;
  const model = formData.get("model") as string ;
  const color = formData.get("color") as string ;
  const plate = (formData.get("plate") as string).toUpperCase();

  try{
    if (intent === "user") {
      return updateUserInfo(userId, {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        baseId,
      });
    } else if (intent === "user-delete") {
      return deleteUserAccount(userId);
    } else if (intent === "vehicle") {
      return createVehicle(userId, year, make, model, color, plate);
    } else if (intent === "vehicle-enable") {
      return enableVehicle(userId, isDriver);
    } else if (intent === "vehicle-delete") {
      return deleteVehicle(id, userId);
    } else if (intent === "create-invite") {
      const createResult = await createInvite(email, userId);
      if (createResult.error) {
        return { success: false, message: createResult.error };
      }
      const emailResult = await sendInvitationEmail(email, userId);
      return emailResult;
    } else if (intent === "regenerate-invite") {
      return updateInvite(id);
    } else if (intent === "disable-invite") {
      return disableInvite(id);
    } else if (intent === "enable-invite") {
      return enableInvite(id);
    } else if (intent === "delete-invite") {
      return deleteInvite(id);
    }
    
  }catch(error){
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, message }
  }
}
  
export default function UserSettings({loaderData, actionData}: Route.ComponentProps) {
  const { user, base, userBase, vehicles, invite } = loaderData;

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
  
  return (
    <UserSettingsModal
      user={user}
      base={base}
      vehicles={vehicles}
      invite={invite}
      userBase={userBase}
    />
  );
}

export { ErrorBoundary };
