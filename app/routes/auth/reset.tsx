import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { CSRFError } from "remix-utils/csrf/server";
import { csrf } from "server/csrf.server";
import { deleteReset } from "server/queries/reset.queries.server";
import { updateUserInfo } from "server/queries/user.queries.server";
import { createUserSession, requireMagicLink, requireSameOrigin } from "server/session.server";
import ResetForm from "~/components/Forms/ResetForm";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireMagicLink(request.url);
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  requireSameOrigin(request);
  await requireMagicLink(request.url);
  
  try {
    await csrf.validate(request);
  } catch (error) {
    if (error instanceof CSRFError) {
      return { success: false, error: "Invalid Security Token" };
    }
    return { success: false, error: "An error occurred" };
  }

  const formData = await request.formData();
  const password = formData.get("password") as string;
  const formUserId = formData.get("userId") as string;
  
  const url = new URL(request.url);
  const urlUserId = url.searchParams.get("userId");
  
  if (formUserId !== urlUserId) {
    throw redirect("/login");
  }

  if (!password || password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters" };
  }

  try {
    await updateUserInfo(urlUserId, { password });
    await deleteReset(urlUserId);
    return await createUserSession(urlUserId, "/dashboard");
  } catch (error) {
    return { success: false, error: "Failed to reset password. Please try again." };
  }
}

export default function Reset() {
  return <ResetForm />;
}

export { ErrorBoundary };