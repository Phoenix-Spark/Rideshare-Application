import { prisma } from "../db.server";

export async function createPickup(name: string, longitude: string, latitude: string) {
  const pickup = await prisma.location.create({
    data: {
        name,
        longitude,
        latitude,
    }
  });
  return pickup;
}