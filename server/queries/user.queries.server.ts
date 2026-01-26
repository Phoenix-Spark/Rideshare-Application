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

export async function getUserId(email: string){
  return await prisma.user.findUnique({
    where:{
      email
    },
    select: {id: true}
  })
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
          isReset: true,
          isInvite: true,
          inviteId: true,
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
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          isAdmin: true,
          baseId: true,
        },
      });
    
    case "verify":
      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
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
  options: {
    firstName?: string,
    lastName?: string,
    email?: string,
    phoneNumber?: string,
    password?: string,
    baseId?: string,
  }
) {
  const { firstName, lastName, email, phoneNumber, password, baseId } = options;
  if (email) {
    const allowedDomains = [
      "@us.af.mil",
      "@army.mil",
      "@mail.mil",
      "@us.navy.mil",
      "@uscg.mil",
      "@usmc.mil",
      "@spaceforce.mil",
    ];
    const emailLower = email.toLowerCase();
    const isMilitaryEmail = allowedDomains.some(domain => emailLower.endsWith(domain));
    if (!isMilitaryEmail) {
      return { error: "Only U.S. military email addresses are allowed" };
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: emailLower,
        id: { not: userId },
      },
    });
    if (existingEmail) {
      return { error: "This email address is already in use by another account" };
    }
  }

  if (phoneNumber) {
    const existingUser = await prisma.user.findFirst({
      where: {
        phoneNumber,
        id: { not: userId },
      },
    });
    if (existingUser) {
      return { error: "This phone number is already in use by another account" };
    }
  }

  const data: any = { 
    firstName, 
    lastName, 
    email: email?.toLowerCase(), 
    phoneNumber, 
    baseId,
  };

  if (password) {
    data.password = await bcrypt.hash(password, 10);
    data.isReset = false;
    data.resetCode = null;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return { success: true, user };
}

export async function updateUserInfoAdmin(
  userId: string,
  options: {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    isAdmin: boolean,
    isDriver: boolean,
    isPassenger: boolean,
    isReset: boolean,
}) {
  if (!userId) throw new Error("userId is required");
  const {firstName, lastName, email, phoneNumber, isAdmin, isDriver, isPassenger, isReset} = options

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
  // const result = await prisma.$transaction([
  //   prisma.request.updateMany({
  //     where: { userId },
  //     data: { userId: null }
  //   }),
  //   prisma.request.updateMany({
  //     where: { driverId: userId },
  //     data: { driverId: null }
  //   }),
  //   prisma.vehicle.deleteMany({
  //     where: { userId: userId }
  //   }),
  //   prisma.reset.deleteMany({
  //     where: { userId }
  //   }),
  //   prisma.user.delete({
  //     where: { id: userId }
  //   })
  // ]);

  const userDelete = await prisma.user.updateMany({
    where: {
      id: userId,
    },
    data: {
      email: null,
      phoneNumber: null,
      password: "",
      isAdmin: false,
      isDriver: false,
      isInvite: false,
      isPassenger: false,
      isReset: false,
      emailVerified:false,
    }
  })

  return userDelete// Return the deleted user
}

export async function getAccounts() {
  const account = await prisma.user.findMany({
    // where: {
    //   isDeleted: false,
    // },
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
      baseId: true,
    },
  });

  return account
}

export async function getUserBase(userId: string) {
  const base = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      base: {
        select: {
          id: true,
          name: true,
        }
      }
    },
  });

  return base;
}