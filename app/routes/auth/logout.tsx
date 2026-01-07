import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { CSRFError } from "remix-utils/csrf/server";
import { csrf } from "server/csrf.server";
import { logoutUser, requireSameOrigin, requireUserId } from "server/session.server";
import LogoutForm from "~/components/Forms/LogoutForm";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";
import type { Route } from "./+types/logout";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  return null;
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

  requireSameOrigin(request);
  await requireUserId(request);
  return logoutUser(request);
}

export default function Logout({ loaderData, actionData }: Route.ComponentProps) {
    return <LogoutForm />;
}

export { ErrorBoundary };