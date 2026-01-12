import { prisma } from "../db.server";
import { eventBus } from "./eventBus.server";

export async function broadcastNewRequest(
  requestId: string,
  baseId: string
): Promise<void> {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
        },
      },
      pickup: { select: { name: true } },
      dropoff: { select: { name: true } },
    },
  });

  if (request) {
    eventBus.notifyDriversAtBase(baseId, {
      type: "new_request",
      payload: { request },
    });
  }
}

export async function broadcastRequestAccepted(
  requestId: string,
  baseId: string,
  passengerId: string,
  driverId: string
): Promise<void> {
  const driver = await prisma.user.findUnique({
    where: { id: driverId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
    },
  });

  const vehicle = await prisma.vehicle.findFirst({
    where: { userId: driverId },
    select: {
      year: true,
      make: true,
      model: true,
      color: true,
      plate: true,
    },
  });

  eventBus.notifyPassenger(passengerId, {
    type: "request_accepted",
    payload: {
      requestId,
      driver: driver
        ? {
            id: driver.id,
            firstName: driver.firstName,
            lastName: driver.lastName,
            phoneNumber: driver.phoneNumber,
            vehicle: vehicle || null,
          }
        : null,
    },
  });

  eventBus.notifyDriversAtBase(baseId, {
    type: "request_accepted",
    payload: {
      requestId,
      driverId,
    },
  });
}

export async function broadcastRequestCancelled(
  requestId: string,
  baseId: string | null,
  passengerId: string | null,
  driverId: string | null,
  cancelledBy: "passenger" | "driver"
): Promise<void> {
  const payload = { requestId, cancelledBy, userId: driverId ?? passengerId };
  console.log(payload, passengerId, driverId, cancelledBy, baseId)

  if (cancelledBy === "passenger" && driverId) {
    eventBus.notifyPassenger(driverId, {
      type: "request_cancelled",
      payload,
    });
  }

  if (cancelledBy === "driver" && passengerId) {
    eventBus.notifyPassenger(passengerId, {
      type: "request_cancelled",
      payload,
    });
  }

  if (baseId) {
    eventBus.notifyDriversAtBase(baseId, {
      type: "request_cancelled_passenger",
      payload,
    });
  }
}

export function broadcastRequestPickup(
  requestId: string,
  passengerId: string
): void {
  eventBus.notifyPassenger(passengerId, {
    type: "request_pickup",
    payload: { requestId },
  });
}

export function broadcastRequestComplete(
  requestId: string,
  passengerId: string
): void {
  eventBus.notifyPassenger(passengerId, {
    type: "request_complete",
    payload: { requestId },
  });
}

export async function broadcastCancelAcceptedRide(
  requestId: string,
  baseId: string,
  passengerId: string
): Promise<void> {
  eventBus.notifyPassenger(passengerId, {
    type: "request_cancelled",
    payload: { requestId, cancelledBy: "driver" },
  });

  const request = await prisma.request.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
        },
      },
      pickup: { select: { name: true } },
      dropoff: { select: { name: true } },
    },
  });

  if (request) {
    eventBus.notifyDriversAtBase(baseId, {
      type: "renew_request",
      payload: { request },
    });
  }
}
