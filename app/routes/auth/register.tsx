import { registerUser } from "server/queries/auth.queries.server";
import RegisterForm from "~/components/Forms/RegisterForm";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";
import { getUserId as getUserIdFromEmail } from "server/queries/user.queries.server";
import { createUserSession } from "server/session.server";
import { csrf } from "server/csrf.server";
import { CSRFError } from "remix-utils/csrf/server";
import { requireSameOrigin } from "server/session.server";
import { sendWelcomeEmail } from "server/queries/verify.queries.server";
// import { validateTurnstile } from "~/components/Input/Captcha";
import { validateTurnstileFromFormData } from "server/utils/turnstile.server";



export const action = async ({ request }: { request: Request }) => {
  requireSameOrigin(request);

  // CSRF validation
  try {
    await csrf.validate(request);
  } catch (error) {
    if (error instanceof CSRFError) {
      return { success: false, message: "Invalid Security Token" };
    }
    return { success: false, message: error };
  }

  const formData = await request.formData();

  // ✓ ADDED: Validate Turnstile first
  const turnstileError = await validateTurnstileFromFormData(formData, request);
  if (turnstileError) {
    return turnstileError;
  }

  // Extract form data
  const inviteCode = formData.get("inviteCode") as string | null;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const password = formData.get("password") as string;
  const base = formData.get("base") as string;

  // Register user
  const result = await registerUser(
    inviteCode,
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    base
  );

  if (result?.error) {
    return { error: result.error };
  }

  // Get user ID and send welcome email
  const { id } = (await getUserIdFromEmail(email))!;
  await sendWelcomeEmail(id, email);

  // Create session and redirect
  return await createUserSession(id, "/login");
};

export default function Register() {
  return <RegisterForm />;
}

export { ErrorBoundary };