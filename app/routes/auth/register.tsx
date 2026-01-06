import { prisma } from "server/db.server";
import { registerUser } from "server/queries/auth.queries.server";
import RegisterForm from "~/components/Forms/RegisterForm";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";
import type { Route } from "./+types/register";
import { getUserId as getUserIdFromEmail } from "server/queries/user.queries.server";
import { createUserSession } from "server/session.server";

import { csrf } from "server/csrf.server";
import { CSRFError } from "remix-utils/csrf/server";
import { requireSameOrigin } from "server/session.server";

export const loader = async () => {
  const bases = await prisma.base.findMany()
  return {bases}
}

export const action = async ({ request }: { request: Request }) => {

  requireSameOrigin(request);

  try {
    await csrf.validate(request);
  } catch (error) {
    if (error instanceof CSRFError) {
      console.error("CSRF validation failed:", error.message);
      return { error: "Invalid security token. Please refresh and try again." };
    }
    throw error;
  }

  const formData = await request.formData();
  const inviteCode = formData.get("inviteCode") as string | null;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const password = formData.get("password") as string;
  const base = formData.get("base") as string;

  const result = await registerUser(
    inviteCode,
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    base,
  );

  if (result?.error) {
    return { error: result.error };
  }
  const {id} = (await getUserIdFromEmail(email))!
  return await createUserSession(id, "/login")
};

export default function Register({ loaderData }: Route.ComponentProps) {
  const {bases} = loaderData;
  return <RegisterForm bases={bases}/>;
}

export { ErrorBoundary };