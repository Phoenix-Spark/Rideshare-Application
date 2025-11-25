import { redirect } from "react-router";
import { registerUser } from "server/queries/auth.queries.server";
import RegisterForm from "~/components/Forms/RegisterForm";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const inviteCode = formData.get("inviteCode") as string | null;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const password = formData.get("password") as string;

  const result = await registerUser(
    inviteCode,
    firstName,
    lastName,
    email,
    phoneNumber,
    password
  );

  if (result?.error) {
    return { error: result.error };
  }

  return redirect("/login");
};

export default function Register() {
  return <RegisterForm />;
}