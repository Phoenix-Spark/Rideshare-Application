import { prisma } from "../db.server";
import bcrypt from "bcryptjs";

export async function getUserInfo(intent: string, userId: string) {
  const user = await prisma.user.findUnique({
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
      base: {
        select: {
          id: true,
          name: true,
          state: true,
        }
      }
    },
  });

  if (!user) return null;

  switch (intent) {
    case "dashboard":
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      };
    case "settings":
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        baseId: user?.base?.id,
        baseName: user?.base?.name,
        baseState: user?.base?.state,
        isAdmin: user.isAdmin,
        isDriver: user.isDriver,
        isPassenger: user.isPassenger,
      };
    case "admin":
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin,
      };
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
  isDriver?: boolean,
) {
  const data: any = { 
    firstName, 
    lastName, 
    email, 
    phoneNumber, 
    baseId,
    isDriver
   };

  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

export async function deleteUserAccount(userId: string) {
  const user = await prisma.user.delete({
    where: { id: userId },
  });

  return user;
}
