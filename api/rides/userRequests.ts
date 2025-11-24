import type { LoaderFunctionArgs } from "react-router";
import { prisma } from "server/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
      console.log('test from api')
      const searchParams = new URL(request.url).searchParams;
      const userId = searchParams.get("userId");

      const userRequests = prisma.request.findMany({
            where: {
                  userId,
            }
      })
      return {rideData: userRequests}
}