import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { getUserInfo } from "server/queries/user.queries.server";
import { checkEmailVerification, requireUserId } from "server/session.server";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";
import type { Route } from "./+types/verify";
import VerifyCodeForm from "~/components/Forms/VerifyCodeForm";
import {
  sendVerificationCode,
  tryVerificationCode,
} from "server/queries/verify.queries.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  await checkEmailVerification(userId, request);
  const user = await getUserInfo("verify", userId);

  return { userId, user };
}

export async function action({ request }: ActionFunctionArgs) {
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

export default function Verify({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { user } = loaderData;
  return <VerifyCodeForm user={user} actionData={actionData} />;
}

export { ErrorBoundary };
