import { redirect, type LoaderFunctionArgs, useActionData } from "react-router";
import { authenticateUser } from "server/queries/auth.queries.server";
import {
  createUserSession,
  getUserId,
  requireSameOrigin,
} from "server/session.server";
import LoginForm from "~/components/Forms/LoginForm";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";
import { csrf } from "server/csrf.server";
import { CSRFError } from "remix-utils/csrf/server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  
  return null;
}

export const action = async ({ request }: { request: Request }) => {
  requireSameOrigin(request);
  
  try {
    await csrf.validate(request);
  } catch (error) {
    if (error instanceof CSRFError) {
      console.error("CSRF validation failed:", error.message);
      throw new Response("Invalid CSRF token", { status: 403 });
    }
    throw error;
  }

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