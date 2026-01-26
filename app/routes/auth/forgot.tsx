import { CSRFError } from "remix-utils/csrf/server";
import { csrf } from "server/csrf.server";
import { createReset } from "server/queries/reset.queries.server";
import { sendMagicLink } from "server/queries/verify.queries.server";
import { requireSameOrigin } from "server/session.server";
import ForgotForm from "~/components/Forms/ForgotForm";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";

export const action = async ({ request }: { request: Request}) => {
  requireSameOrigin(request);

  try {
    await csrf.validate(request);
  } catch (error) {
    if (error instanceof CSRFError) {
      return { success: false, message: "Invalid Security Token" };
    }
    return { success: false, message: error };
  }

  const formData = await request.formData();
  
  const email = formData.get("email") as string;
  
  if (!email) {
    return { error: "Email is required" };
  }
  
  try {
    await createReset(email)
    await sendMagicLink(email)

  }catch(error){
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, message }
  }
}

export default function Forgot() {
    return <ForgotForm />;
}

export { ErrorBoundary };