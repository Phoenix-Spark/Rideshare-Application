import { prisma } from "../db.server";
import bcrypt from "bcryptjs";

export async function registerUser(
  inviteCode: string | null,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string,
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findFirst({
    where: { isAdmin: true },
  });
  const isAdmin = existingAdmin ? false : true;

  let inviteId: string | null = null;

  if (inviteCode) {
    const invite = await prisma.invite.findFirst({
      where: {
        code: inviteCode,
        email,
        isActive: true,
      },
      select: { id: true },
    });

    if (!invite) {
      return { error: "Invalid invite code" };
    }

    inviteId = invite.id;
  } else {
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
      return { error: "Only U.S. military email addresses are allowed without a valid invite code" };
      
    }
  }

  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        isAdmin,
        isInvite: !!inviteId,
        inviteId: inviteId,
        inviteCode: inviteId ? inviteCode : null,
      },
    });

    return user;
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "Email is already in use" };
    }
    return {error: "Something went wrong" };
  }
}

export async function authenticateUser( email: string, password: string ) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
    }
  });

  if (!user || !user.password) { return null; }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) { return null; }
  
  return {
    id: user.id, 
    email: user.email
  };
}

export async function authenticateAdmin( userId: string ) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isAdmin: true
    },
  });

  if (!user) {
    return null;
  }
  return user.isAdmin;
}