
import { useLoaderData, redirect } from "react-router";
import { registerUser } from "server/queries/auth.queries.server";
import RegisterForm from "~/components/Forms/RegisterForm";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await registerUser(
      firstName ?? "", 
      lastName ?? "", 
      email,
      phoneNumber ?? "", 
      password
    );
    return redirect("/login");
  } catch (error: any) {
    return { error: error.message || "Something went wrong..." };
  }
};

export default function Register() {
  return <RegisterForm />;
}