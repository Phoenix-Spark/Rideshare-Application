import { prisma } from "../db.server";

export async function createRequest(
  userId: string,
  pickupId: string,
  dropoffId: string
) {
  const request = await prisma.request.create({
    data: {
      userId,
      pickupId,
      dropoffId,
      status: "Pending",
    },
  });
  return request;
}

export async function getUserRequest(userId: string) {
  const request = await prisma.request.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      createdAt: true,
      status: true,
      driverId: true,
      pickedUpAt: true,
      dropoffId: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true,
        },
      },
      pickup: {
        select: {
          name: true,
          description: true,
          longitude: true,
          latitude: true,
        },
      },
      dropoff: {
        select: {
          name: true,
          description: true,
          longitude: true,
          latitude: true,
        },
      },
    },
  });

  return request;
}

export async function updateRequest(id: string) {
  const request = await prisma.request.updateMany({
    where: { id },
    data: {},
  });
  return request;
}

export async function cancelRequest(id: string) {
  const request = await prisma.request.updateMany({
    where: { id },
    data: {
      status: "Cancelled",
    },
  });

  return request;
}
