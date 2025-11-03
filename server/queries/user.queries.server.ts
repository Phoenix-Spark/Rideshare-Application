import { prisma } from "../db.server";
import bcrypt from "bcryptjs";

export async function getUserInfo(intent: string, userId: string) {
  const dashboard = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  const settings = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
    },
  });

  if (intent === "dashboard") {
    return dashboard;
  } else if (intent === "settings") {
    return settings;
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
