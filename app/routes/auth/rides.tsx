import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getAllRidesForExport, getRidesByBase, getUserBase } from "server/queries/user.queries.server";
import { requireUserId } from "server/session.server";
import CreateRidesTable from "~/components/Forms/CreateRidesTable";
import type { Route } from "./+types/rides";

export const action = async ({ request }: ActionFunctionArgs) => {
      const userId = await requireUserId(request);
      const user = await getUserBase(userId);
      if (!user?.base) {
            return { rides: [] };
      }

      const formData = await request.formData();
      const search = formData.get("search") as string || undefined;

      const rides = await getAllRidesForExport({
            baseId: user.base.id,
            search,
      });

      return { rides };
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
      const userId = await requireUserId(request);
      const user = await getUserBase(userId);
      if (!user?.base) {
            return { rides: [], totalCount: 0, totalPages: 0, currentPage: 1 };
      }

      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get("page") || "1", 25);
      const search = url.searchParams.get("search") || undefined;

      const result = await getRidesByBase({
            baseId: user.base.id,
            page,
            pageSize: 25,
            search,
      });

      return result;
};

export default function Rides({ loaderData }: Route.ComponentProps) {
      const { rides, totalCount, totalPages, currentPage } = loaderData;
      return (
            <CreateRidesTable
                  rides={rides}
                  totalCount={totalCount}
                  totalPages={totalPages}
                  currentPage={currentPage}
            />
      );
}