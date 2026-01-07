import { registerUser } from "server/queries/auth.queries.server";
import RegisterForm from "~/components/Forms/RegisterForm";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";
import { getUserId as getUserIdFromEmail } from "server/queries/user.queries.server";
import { createUserSession } from "server/session.server";
import { csrf } from "server/csrf.server";
import { CSRFError } from "remix-utils/csrf/server";
import { requireSameOrigin } from "server/session.server";

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

export default function Register() {
  return <RegisterForm />;
}

export { ErrorBoundary };