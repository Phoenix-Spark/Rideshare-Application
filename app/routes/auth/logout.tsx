import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { logoutUser, requireUserId } from "server/session.server";
import LogoutForm from "~/components/Forms/LogoutForm";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  await requireUserId(request);
  return logoutUser(request);
}

export default function Logout() {
    return <LogoutForm />;
}