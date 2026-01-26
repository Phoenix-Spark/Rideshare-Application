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

export async function getActivePassengerRequest(userId: string){
  return await prisma.request.findMany({
    where: {
      userId,
      status: {
        in: ['Pending', 'Accepted', 'In-Progress']
      }
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
    where: { 
      userId,
      status: {
        not: {
          in: [ 'Cancelled', 'Completed']
        }
      }
     },
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

export async function getRidesByBase({ baseId, page = 1, pageSize = 25, search }: GetRidesParams) {
  const skip = (page - 1) * pageSize;

  const where: any = { baseId };

  if (search) {
    where.OR = [
      { user: { firstName: { contains: search, mode: 'insensitive' } } },
      { user: { lastName: { contains: search, mode: 'insensitive' } } },
      { driver: { firstName: { contains: search, mode: 'insensitive' } } },
      { driver: { lastName: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const [rides, totalCount] = await Promise.all([
    prisma.request.findMany({
      where,
      skip,
      take: pageSize,
      select: {
        id: true,
        status: true,
        dropoff: {
          select: {
            name: true,
          }
        },
        pickup: {
          select: {
            name: true,
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        driver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        }
      },
      orderBy: {
        id: 'desc'
      }
    }),
    prisma.request.count({ where })
  ]);

  return {
    rides,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
  };
}

export async function getAllRidesForExport({ baseId, search }: GetAllRidesParams) {
  const where: any = { baseId };

  if (search) {
    where.OR = [
      { user: { firstName: { contains: search, mode: 'insensitive' } } },
      { user: { lastName: { contains: search, mode: 'insensitive' } } },
      { driver: { firstName: { contains: search, mode: 'insensitive' } } },
      { driver: { lastName: { contains: search, mode: 'insensitive' } } },
    ];
  }

  return await prisma.request.findMany({
    where,
    select: {
      id: true,
      status: true,
      createdAt: true,
      dropoff: {
        select: {
          name: true,
        }
      },
      pickup: {
        select: {
          name: true,
        }
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getRidesByUser(userId: string) {
  const request = await prisma.request.findMany({
    where: { 
      OR: [
        { userId }, // Rides as passenger
        { driverId: userId } // Rides as driver
      ]
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
      droppedOffAt: true,
      base: {
        select: {
          state: true,
        },
      },
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      driver: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      pickup: {
        select: {
          name: true,
          longitude: true,
          latitude: true,
        },
      },
      dropoff: {
        select: {
          name: true,
          longitude: true,
          latitude: true,
        },
      },
    }
  });
  return { request }
}
interface GetRidesParams {
  baseId: string;
  page?: number;
  pageSize?: number;
  search?: string;
}
interface GetAllRidesParams {
  baseId: string;
  search?: string;
}
