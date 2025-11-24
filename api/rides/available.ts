import type { LoaderFunctionArgs } from "react-router";
import { prisma } from "server/db.server";
import { requireUserId } from "server/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
      console.log('test loader')
      const userId = await requireUserId(request)
      const availableRides = await prisma.request.findMany({
            where: {
                  status: "Pending"
            },
            include: {
                  user:{
                        select: {
                              firstName: true,
                              lastName: true,
                              phoneNumber: true,
                        }
                  }
            }
      })
      return {availableRides, userId}
}