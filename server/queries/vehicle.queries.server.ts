import { prisma } from "../db.server";

export async function enableVehicle(userId: string, isDriver: boolean) {
  const vehicle = await prisma.user.update({
    where: { id: userId},
    data: { isDriver },
  });
  return vehicle;
}

export async function createVehicle(
  userId: string,
  year: string,
  make: string,
  model: string,
  color: string,
  plate: string,
) {
  const vehicle = await prisma.vehicle.create({
    data: {
      userId,
      year,
      make,
      model,
      color,
      plate,
    },
  });

  return vehicle;
}

export async function getVehicles(userId: string) {
  return prisma.vehicle.findMany({
    where: { userId },
    select: {
      id: true,
      year: true,
      make: true,
      model: true,
      color: true,
      plate: true,
      createdAt: true,
    },
  });
}

export async function deleteVehicle(id: string) {
  const vehicle = await prisma.vehicle.delete({
    where: { id },
  });

  return vehicle;
}