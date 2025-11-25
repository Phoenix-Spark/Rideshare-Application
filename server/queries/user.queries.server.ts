import { prisma } from "../db.server";
import bcrypt from "bcryptjs";

function generateRandomCode(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function getUserInfo(intent: string, userId: string) {
  switch (intent) {
    case "dashboard":
      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          isAdmin: true,
          isReset: true,
          isDriver: true,
          base: {
            select: {
              id: true,
              name: true,
              long: true,
              lat: true,
            }
          }
        },
      });

    case "settings":
      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          isAdmin: true,
          isDriver: true,
          isPassenger: true,
          isInvite: true,
          inviteCode: true,
          base: {
            select: {
              id: true,
              name: true,
              state: true,
            },
          },
        },
      });

    case "admin":
      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          isAdmin: true,
          baseId: true,
        },
      });

    case "requests":
      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          baseId: true,
        },
      });

    default:
      return null;
  }
}

export async function getBaseInfo() {
  const base = await prisma.base.findMany({
    select: {
      id: true,
      name: true,
      state: true,
    },
  });

  return{ base };
}

export async function updateUserInfo(
  userId: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  phoneNumber?: string,
  password?: string,
  baseId?: string,
) {
  const data: any = { 
    firstName, 
    lastName, 
    email, 
    phoneNumber, 
    baseId,
   };

  if (password) {
    data.password = await bcrypt.hash(password, 10);
    data.isReset = false;
    data.resetCode = null;
  }

  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

export async function updateUserInfoAdmin({
  userId,
  firstName,
  lastName,
  email,
  phoneNumber,
  isAdmin,
  isDriver,
  isPassenger,
  isReset,
}: {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  isAdmin?: boolean;
  isDriver?: boolean;
  isPassenger?: boolean;
  isReset?: boolean;
}) {
  if (!userId) throw new Error("userId is required");

  const data: any = {
    firstName,
    lastName,
    email,
    phoneNumber,
    isAdmin,
    isDriver,
    isPassenger,
    isReset,
  };

  if (isReset) {
    const resetCode = generateRandomCode(10);
    data.password = await bcrypt.hash(resetCode, 10);
    data.resetCode = resetCode;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return user;
}

export async function deleteUserAccount(userId: string) {
  const user = await prisma.user.delete({
    where: { id: userId },
  });

  let vehicle = null;

  const existingVehicle = await prisma.vehicle.findUnique({
    where: { userId: userId },
  });

  if (existingVehicle) {
    vehicle = await prisma.vehicle.delete({
      where: { userId: userId },
    });
  }

  return user;
}

export async function getAccounts() {
  const account = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      email: true,
      isAdmin: true,
      isDriver: true,
      isPassenger: true,
      isReset: true,
      resetCode: true,
      isInvite: true,
    },
  });

  return account
}
