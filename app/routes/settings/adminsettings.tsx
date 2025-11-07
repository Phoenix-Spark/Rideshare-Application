import { type LoaderFunctionArgs, type ActionFunctionArgs, useLoaderData } from "react-router";
import { createBase, deleteBase, getBase, updateBase } from "server/queries/base.queries.server";
import { createStop, deleteStop, getStop, updateStop } from "server/queries/station.queries.server";
import { getUserInfo } from "server/queries/user.queries.server";
import { requireAdminId, requireUserId } from "server/session.server";
import AdminSettingsModal from "~/components/Modals/AdminSettingsModal";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId  = await requireUserId(request);
  const user    = await getUserInfo('admin', userId);
  const base    = await getBase();
  const station = await getStop();

  return { user, base, station };
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  await requireAdminId(userId)

  const formData    = await request.formData();
  const intent      = formData.get("intent") as string;

  const baseId      = formData.get("baseId") as string || undefined;
  const id          = formData.get("id") as string || undefined;
  const name        = formData.get("name") as string || undefined;
  const state       = formData.get("state") as string || undefined;
  const longitude   = formData.get("longitude") as string || undefined;
  const latitude    = formData.get("latitude") as string || undefined;
  const description = formData.get("description") as string || undefined
  
  if (intent === "createBase") {
    return createBase(name!, state!, longitude!, latitude!);
  } 
  if (intent === "updateBase") {
    return updateBase(id!, name!, state!, longitude!, latitude!);
  } 
  if (intent === "deleteBase") {
    return deleteBase(id!)
  }
  if (intent === "createStop") {
    return createStop(baseId!, name!, longitude!, latitude!, description!)
  }
  if (intent === "updateStop") {
    return updateStop(id!, baseId!, name!, longitude!, latitude!, description!)
  }
  if (intent === "deleteStop") {
    return deleteStop(id!)
  }
}

export default function AdminSettings() {
    
    const { user, base, station } = useLoaderData<typeof loader>();
    return <AdminSettingsModal user={user} base={base} station={station} />
}