import { sendEmail } from "lib/email/mailer";
import { prisma } from "../db.server";
import crypto from "node:crypto";
import { getBaseUrl } from "lib/helper/utils";

function generateVerificationCode(length = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charsLength = chars.length;
  let code = "";
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    code += chars[randomBytes[i] % charsLength];
  }
  return code;
}

export async function tryVerificationCode(userId: string, code: string) {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        emailVerificationCode: true,
        emailVerificationCodeExpiration: true,
        emailVerificationAttempts: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    if (user.emailVerificationCodeExpiration && user.emailVerificationCodeExpiration < new Date()) {
      return { error: "Verification code expired. Request a new one." };
    }

    if (user.emailVerificationAttempts >= 3) {
      return { error: "Maximum attempts reached. Please request a new verification code." };
    }

    if (user.emailVerificationCode === code.toUpperCase()) {
      await tx.user.update({
        where: { id: userId },
        data: {
          emailVerified: true,
          emailVerificationCode: null,
          emailVerificationCodeExpiration: null,
          emailVerificationAttempts: 0,
          emailVerificationCodeSendLimit: null,
        },
      });

      return { success: true };
    }

    const updated = await tx.user.update({
      where: { id: userId },
      data: {
        emailVerificationAttempts: { increment: 1 },
      },
      select: {
        emailVerificationAttempts: true,
      },
    });

    const attemptsRemaining = 3 - updated.emailVerificationAttempts;

    return {
      error: `Incorrect verification code. ${
        attemptsRemaining > 0 ? `${attemptsRemaining} attempt${attemptsRemaining !== 1 ? 's' : ''} remaining.` : "No attempts remaining."
      }`,
    };
  });
}

export async function sendVerificationCode(userId: string, email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        emailVerificationCodeSendLimit: true,
        firstName: true,
        lastName: true,
      }
    });

    if (user?.emailVerificationCodeSendLimit && user.emailVerificationCodeSendLimit > new Date()) {
      return { error: "Please try again in 5 minutes." };
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return { error: "SMTP configuration is missing from environment variables." };
    }

    const verificationCode = generateVerificationCode();

    await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerificationCodeSendLimit: new Date(Date.now() + 5 * 60 * 1000),
        emailVerificationAttempts: 0,
        emailVerificationCode: verificationCode,
        emailVerificationCodeExpiration: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    await sendEmail(email, { type: 'verification', data: { code: verificationCode } });

    return { success: true };
  } catch (error) {
    return { error: "Failed to send verification code. Please try again." };
  }
}

export async function sendWelcomeEmail(userId: string, email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        firstName: true,
        lastName: true,
      }
    });

    if (!user) {
      return { error: "User not found" };
    }

    const username = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'there';

    await sendEmail(email, { 
      type: 'welcome', 
      data: { username } 
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to send welcome email." };
  }
}

export async function sendMagicLink(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });

    if (!user) {
      return { success: true };
    }

    const reset = await prisma.reset.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        token: true,
        userId: true,
        validUntil: true,
        code: true,
      }
    });

    if (!reset) {
      return { error: "Reset token not found" };
    }

    const baseUrl = getBaseUrl();
    const resetLink = `${baseUrl}/reset?token=${encodeURIComponent(reset.token)}&id=${reset.id}&userId=${reset.userId}&valid=${reset.validUntil.toISOString()}&code=${reset.code}`;

    await sendEmail(email, { 
      type: 'passwordReset', 
      data: { resetLink }
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send magic link:', error);
    return { error: "Failed to send reset link. Please try again." };
  }
}