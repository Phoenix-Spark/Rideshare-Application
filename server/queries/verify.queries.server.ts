import { prisma } from "../db.server";
import crypto from "node:crypto";
import nodemailer from "nodemailer";

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

export async function sendVerificationCode(userId: string, email: string) {
  try {
    console.log('userId: ', userId, email)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerificationCodeSendLimit: true }
    });

    console.log('user: ', user)

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

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Base Bound" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify Your Email Address",
      text: `Your Base Bound verification code is: ${verificationCode}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this code, please ignore this email.`,
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f7;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f7;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
              
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Base Bound</h1>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Verify Your Email Address</h2>
                  <p style="margin: 0 0 24px; color: #4a5568; font-size: 16px; line-height: 24px;">
                    Thank you for signing up! Please use the verification code below to complete your registration:
                  </p>
                  
                  <!-- Verification Code Box -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                    <tr>
                      <td style="background-color: #f7fafc; border: 2px dashed #cbd5e0; border-radius: 8px; padding: 24px; text-align: center;">
                        <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace;">
                          ${verificationCode}
                        </div>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 24px 0 0; color: #718096; font-size: 14px; line-height: 20px;">
                    This code will expire in <strong>5 minutes</strong>. If you didn't request this code, please ignore this email.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 32px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 18px; text-align: center;">
                    This is an automated message, please do not reply to this email.
                  </p>
                  <p style="margin: 8px 0 0; color: #a0aec0; font-size: 12px; line-height: 18px; text-align: center;">
                    © ${new Date().getFullYear()} Base Bound. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
    });

    return { success: true };

  } catch (error) {
    console.error("Failed to send verification code:", error);
    return { error: "Failed to send verification code. Please try again." };
  }
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

    // If code matches
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
