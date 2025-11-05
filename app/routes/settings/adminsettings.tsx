import { type LoaderFunctionArgs, type ActionFunctionArgs, useLoaderData } from "react-router";
import { createBase, deleteBase, getBase, updateBase } from "server/queries/base.queries.server";
import { getUserInfo } from "server/queries/user.queries.server";
import { requireAdminId, requireUserId } from "server/session.server";
import AdminSettingsModal from "~/components/Modals/AdminSettingsModal";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const user = await getUserInfo('admin', userId);
  const base = await getBase();
  return { user, base };
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  await requireAdminId(userId)

  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const id = formData.get("id") as string || undefined;
  const name = formData.get("name") as string || undefined;
  const state = formData.get("state") as string || undefined;
  const longitude = formData.get("longitude") as string || undefined;
  const latitude = formData.get("latitude") as string || undefined;
  
  if (intent === "createBase") {
    return createBase(name!, state!, longitude!, latitude!);
  } 
  if (intent === "updateBase") {
    return updateBase(id!, name!, state!, longitude!, latitude!);
  } 
  if (intent === "deleteBase") {
    return deleteBase(id!)
  }
}

export default function AdminSettings() {
    
    const { user, base } = useLoaderData<typeof loader>();
    return <AdminSettingsModal user={user} base={base}/>
}