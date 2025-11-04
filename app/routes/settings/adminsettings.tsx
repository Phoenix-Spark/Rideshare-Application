import { type LoaderFunctionArgs, type ActionFunctionArgs, useLoaderData } from "react-router";
import { getUserInfo } from "server/queries/user.queries.server";
import { requireUserId } from "server/session.server";
import AdminSettingsModal from "~/components/Modals/AdminSettingsModal";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const user = await getUserInfo('admin', userId);

  return { user };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

}

export default function AdminSettings() {
    const { user } = useLoaderData<typeof loader>();
    return <AdminSettingsModal user={user}/>
}