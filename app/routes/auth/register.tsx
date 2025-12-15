import { redirect } from "react-router";
import { prisma } from "server/db.server";
import { registerUser } from "server/queries/auth.queries.server";
import RegisterForm from "~/components/Forms/RegisterForm";
import { ErrorBoundary } from "~/components/Utilities/ErrorBoundary";
import type { Route } from "./+types/register";

export const loader = async ({}) => {
  const bases = await prisma.base.findMany()
  return {bases}
}

export const action = async ({ request }: { request: Request }) => {
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

  return redirect("/login");
};

export default function Register({ loaderData }: Route.ComponentProps) {
  const {bases} = loaderData;
  return <RegisterForm bases={bases}/>;
}

export { ErrorBoundary };