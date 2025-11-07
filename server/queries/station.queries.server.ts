import { prisma } from "../db.server";

export async function createStop(
  baseId: string,
  name: string,
  longitude: string,
  latitude: string,
  description?: string
) {
  const stop = await prisma.station.create({
    data: {
      baseId,
      name,
      longitude,
      latitude,
      description,
    },
  });

  return stop;
}

export async function getStop() {
  const stop = await prisma.station.findMany({
    select: {
      id: true,
      baseId: true,
      name: true,
      longitude: true,
      latitude: true,
      description: true,
      base: {
        select: {
          name: true,
        },
      },
    },
  });

  return stop;
}

export async function updateStop(
  id: string,
  baseId: string,
  name: string,
  longitude: string,
  latitude: string,
  description: string
) {
  const stop = await prisma.station.update({
    where: { id },
    data: {
      baseId,
      name,
      longitude,
      latitude,
      description,
    },
  });

  return stop;
}

export async function deleteStop(id: string) {
  const stop = await prisma.station.delete({
    where: { id },
  });

  return stop;
}
