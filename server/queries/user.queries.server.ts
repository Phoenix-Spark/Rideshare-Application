import { prisma } from "../db.server";
import bcrypt from "bcryptjs";

export async function getUserInfo(intent: string, userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      isAdmin: true,
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
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
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


export async function updateUserInfo(
  userId: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  phoneNumber?: string,
  password?: string
) {
  const data: any = { firstName, lastName, email, phoneNumber };

  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  return prisma.user.update({
    where: { id: userId },
    data,
  });
}
