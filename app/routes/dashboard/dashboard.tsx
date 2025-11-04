import { useLoaderData, type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import { getUserInfo } from "server/queries/user.queries.server";
import { requireUserId } from "server/session.server";
import DashboardForm from "~/components/Forms/DashboardForm";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const user = await getUserInfo('dashboard', userId);
  
  return{user};
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();
  return <DashboardForm user={user}/>;
}
