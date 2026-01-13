import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
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
  await requireSameOrigin(request);
  
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
  const userId = formData.get("userId") as string;

  if (!password || password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters" };
  }

  try {
    await updateUserInfo(userId, password);
    await deleteReset(userId);
    await createUserSession(userId, "/dashboard");
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: "Failed to reset password. Please try again." };
  }
}

export default function Reset() {
  return <ResetForm />;
}

export { ErrorBoundary };