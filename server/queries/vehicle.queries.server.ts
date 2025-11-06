import { prisma } from "../db.server";

export async function createVehicle(
  userId: string,
  year: string,
  make: string,
  model: string,
  color: string,
  plate: string
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

  return { vehicle };
}

export async function getVehicles(userId: string) {
  const vehicle = await prisma.vehicle.findMany({
    where: { userId: userId },
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

  return vehicle;
}

export async function deleteVehicle(id: string) {
  const vehicle = await prisma.vehicle.delete({
    where: { id },
  });

  return vehicle;
}
