import { prisma } from "../db.server";

const VALID_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma",
  "Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee",
  "Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
] as const;

export type StateType = (typeof VALID_STATES)[number];

export async function createBase(
  name: string,
  state: string,
  longitude: string,
  latitude: string
) {
  if (!VALID_STATES.includes(state as StateType)) {
    return("Invalid state submitted");
  }

  const base = await prisma.base.create({
    data: {
      name,
      state,
      long: longitude,
      lat: latitude,
    },
  });

  return base;
}

export async function getBase() {
  const base = await prisma.base.findMany({
    select: {
      id: true,
      name: true,
      state: true,
      long: true,
      lat: true,
    },
  });

  return base;
}

export async function updateBase(
  id: string,
  name: string,
  state: string,
  longitude: string,
  latitude: string
) {
  const base = await prisma.base.update({
    where: { id },
    data: {
      name: name,
      state: state,
      long: longitude,
      lat: latitude,
    },
  });

  return base;
}

export async function deleteBase(id: string) {
  const base = await prisma.base.delete({
    where: { id },
  });

  return base;
}
