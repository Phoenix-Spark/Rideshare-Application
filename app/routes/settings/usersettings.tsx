import { useLoaderData, type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import { getUserInfo, updateUserInfo } from "server/queries/user.queries.server";
import { requireUserId } from "server/session.server";
import UserSettingsModal from "~/components/Modals/UserSettingsModal";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const user = await getUserInfo('settings', userId);
  
  return{user};
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const firstName   = formData.get("firstName") as string || undefined;
  const lastName    = formData.get("lastName") as string || undefined;
  const email       = formData.get("email") as string || undefined;
  const password    = formData.get("password") as string || undefined;
  const phoneNumber = formData.get("phoneNumber") as string || undefined;

  return updateUserInfo(userId, firstName, lastName, email, phoneNumber, password);
}

export default function UserSettings() {
    const { user } = useLoaderData<typeof loader>();
    return <UserSettingsModal user={user}/>
}