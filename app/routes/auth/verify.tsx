import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { getUserInfo } from "server/queries/user.queries.server";
import { checkEmailVerification, requireSameOrigin, requireUserId } from "server/session.server";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";
import type { Route } from "./+types/verify";
import VerifyCodeForm from "~/components/Forms/VerifyCodeForm";
import {
  sendVerificationCode,
  tryVerificationCode,
} from "server/queries/verify.queries.server";
import { CSRFError } from "remix-utils/csrf/server";
import { csrf } from "server/csrf.server";
import { useEffect } from "react";
import { toast } from "react-toastify";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  await checkEmailVerification(userId, request);

  const user = await getUserInfo("verify", userId);
  return { userId, user, };
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
  
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const userId = formData.get("userId") as string;
  const email = formData.get("email") as string;
  const code = formData.get("code") as string;

  if (intent === "tryCode") {
    return tryVerificationCode(userId, code);
  }
  if (intent === "sendCode") {
    return sendVerificationCode(userId, email);
  }
}

export default function Verify({ loaderData, actionData, }: Route.ComponentProps) {
  const { user } = loaderData;

  useEffect(() => {
    if (actionData?.success) {
      if(actionData.message.length > 0){ 
        toast.success(actionData.message);
      }
    }
    if (actionData && !actionData?.success) {
      toast.error(actionData.message);
    }
  }, [actionData]);
  return <VerifyCodeForm user={user} actionData={actionData}/>;
}

export { ErrorBoundary };
