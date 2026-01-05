import { redirect, type LoaderFunctionArgs, useActionData } from "react-router";
import { authenticateUser } from "server/queries/auth.queries.server";
import {
  createUserSession,
  getUserId,
  requireSameOrigin,
} from "server/session.server";
import LoginForm from "~/components/Forms/LoginForm";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);

  // console.log('uId: ',userId)
  if (userId) return redirect("/dashboard");
}

export const action = async ({ request }: { request: Request }) => {
  requireSameOrigin(request);
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await authenticateUser(email, password);
  if (!user) {
    return { error: "Invalid credentials" };
  }

  return createUserSession(user.id, "/dashboard");
};

export default function Login() {
  const actionData = useActionData<{ error?: string }>();
  return <LoginForm error={actionData?.error} />;
}

export { ErrorBoundary };
