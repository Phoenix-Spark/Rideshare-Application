
import { redirect, useActionData } from "react-router";
import { registerUser } from "server/queries/auth.queries.server";
import RegisterForm from "~/components/Forms/RegisterForm";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const inviteCode = formData.get("inviteCode") as string || undefined;
  const firstName = formData.get("firstName") as string || undefined;
  const lastName = formData.get("lastName") as string || undefined;
  const email = formData.get("email") as string || undefined;
  const phoneNumber = formData.get("phoneNumber") as string || undefined;
  const password = formData.get("password") as string || undefined;

  try {
    await registerUser(inviteCode!, firstName!, lastName!, email!, phoneNumber!, password!);
    // return redirect("/login");
  } catch (error: any) {
    return { error: error.message || "Something went wrong..." };
  }
};

export default function Register() {
  return <RegisterForm />;
}