import { prisma } from "../db.server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

function generateSecureNumericCode(length: number): string {
  const bytes = crypto.randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) {
    code += (bytes[i] % 10).toString();
  }
  return code;
}

export async function createReset(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) return null;

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(token, 12);
  const code = generateSecureNumericCode(20);

  const validUntil = new Date(Date.now() + 10 * 60 * 1000);

  const reset = await prisma.reset.create({
    data: {
      token: hashedToken,
      userId: user.id,
      validUntil,
      code,
    },
  });

  return { reset, token };
}

export async function deleteReset(userId: string) {
    return await prisma.reset.deleteMany({
      where: { userId },
    });
}