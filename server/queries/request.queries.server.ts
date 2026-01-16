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
    
    select: {
      id: true,
      status: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true,
          id: true,
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
  });

  return request;
}

export async function getActiveRequest(baseId: string) {
  const request = await prisma.request.findMany({
    where: {
      // status: 'Pending',
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
          id: true,
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
          id: true,
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
          id: true,
        },
      },
      pickedUpAt: true,
      dropoffId: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true,
          id: true,
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

export async function cancelRequest(id: string, driverId: string | null) {
  const request = await prisma.request.updateMany({
    where: { id },
    data: {
      status: "Cancelled",
    },
  });
  return request;
}

export async function acceptRequest(requestId: string, driverId: string, userId: string) {
  const request = await prisma.request.updateMany({
    where: { id: requestId, driverId: null },
    data: {
      driverId: driverId,
      status: 'Accepted',
      updatedAt: new Date(Date.now()),
      acceptedAt: new Date(Date.now()),
    },
  });

  return request;
}

export async function pickupRequest(requestId: string, userId: string) {
  const request = await prisma.request.updateMany({
    where: { id: requestId },
    data: {
      status: 'In-Progress',
      updatedAt: new Date(Date.now()),
      pickedUpAt: new Date(Date.now()),
    },
  });
  return request;
}

export async function dropOffRequest(requestId: string, userId: string) {
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

export async function cancelAcceptedRide(requestId: string, userId: string, pickupId: string){
  const request = await prisma.request.updateMany({
    where: {id: requestId},
    data: {
      status: 'Pending',
      updatedAt: new Date(Date.now()),
      acceptedAt: null,
      driverId: null,
    }
  })
  return request;
}
