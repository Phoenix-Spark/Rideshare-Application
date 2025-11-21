
import { notifyDriversOfNewRide } from "server/websocket.server";
import { prisma } from "../db.server";

export async function createRequest(
  userId: string,
  baseId: string,
  pickupId: string,
  dropoffId: string
) {
  const request = await prisma.request.create({
    data: {
      userId,
      baseId,
      pickupId,
      dropoffId,
      status: "Pending",
    },
  });

  notifyDriversOfNewRide(request.id, pickupId)
  return request;
}

export async function getActiveRequest(baseId: string) {
  const request = await prisma.request.findMany({
    where: {
      status: 'Pending',
      baseId,
    },
    select: {
      id: true,
      status: true,
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
        },
      },
      dropoff: {
        select: {
          name: true,
        },
      },
    },
  })
  return request;
}

export async function getDriverRequest(userId: string) {
  const request = await prisma.request.findMany({
    where: {
      driverId: userId,
      status: { in: ['Accepted', 'In-Progress'] },
    },
    select: {
      id: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true,
        },
      },
      createdAt: true,
      status: true,
      pickedUpAt: true,
      dropoffId: true,
      acceptedAt: true,
      pickup: {
        select: {
          name: true,
          description: true,
        },
      },
      dropoff: {
        select: {
          name: true,
          description: true,
        },
      },
    },
  });

  return request;
}

export async function getPassengerRequest(userId: string) {
  const requests = await prisma.request.findMany({
    where: { userId },
    select: {
      id: true,
      createdAt: true,
      status: true,
      driverId: true,
      driver: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true,
        },
      },
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

  const requestsWithVehicle = await Promise.all(
    requests.map(async (req) => {
      let vehicle = null;
      if (req.driverId) {
        vehicle = await prisma.vehicle.findFirst({
          where: { userId: req.driverId },
          select: {
            year: true,
            make: true,
            model: true,
            color: true,
            plate: true,
          },
        });
      }
      return { ...req, vehicle };
    })
  );

  return requestsWithVehicle;
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

export async function acceptRequest(requestId: string, userId: string) {
  const request = await prisma.request.updateMany({
    where: { id: requestId },
    data: {
      driverId: userId,
      status: 'Accepted',
      updatedAt: new Date(Date.now()),
      acceptedAt: new Date(Date.now()),
    },
  });
  return request;
}

export async function pickupRequest(requestId: string) {
  const request = await prisma.request.updateMany({
    where: { id: requestId },
    data: {
      status: 'In-Progress',
      updatedAt: new Date(Date.now()),
      pickedUpAt: new Date(Date.now()),
    },
  });
  // notifyDriversOfNewRide(requestId, requestId)
  return request;
}

export async function dropOffRequest(requestId: string) {
  const request = await prisma.request.updateMany({
    where: { id: requestId },
    data: {
      status: 'Completed',
      updatedAt: new Date(Date.now()),
      droppedOffAt: new Date(Date.now()),
    },
  });
  return request;
}
