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
import type { Route } from "./+types/login";

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
      return {success: false, message: "Invalid Security Token"}
    }
    return {success: false, message: error}
  }

  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  try{

    if (!email || !password) {
      return { error: "Email and password are required" };
    }
    
    const user = await authenticateUser(email, password);
    if (!user) {
      return { error: "Invalid credentials" };
    }
    
    return await createUserSession(user.id, "/dashboard");
  }catch(error){
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, message }
  }
};

export default function Login({ actionData }: Route.ComponentProps) {
  return <LoginForm error={actionData?.error} />;
}

export { ErrorBoundary };