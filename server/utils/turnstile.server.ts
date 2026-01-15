// server/utils/turnstile.server.ts
import { prisma } from "server/db.server";
import { validateTurnstile } from "~/components/Input/Captcha";

interface TurnstileValidationError {
  success: false;
  error: string;
  errorCodes?: string[];
}

/**
 * Validates Turnstile token from formData and prevents token reuse
 * @param formData - The FormData from the request
 * @param request - The Request object (for IP extraction)
 * @returns null if valid, error object if invalid
 */
export async function validateTurnstileFromFormData(
  formData: FormData,
  request: Request
): Promise<TurnstileValidationError | null> {
  const turnstileToken = formData.get('cf-turnstile-response') as string;

  if (!turnstileToken) {
    return {
      success: false,
      error: "Security verification missing. Please complete the verification.",
    };
  }

  const isUsed = await isTokenUsed(turnstileToken);
  if (isUsed) {
    console.warn('Attempted token reuse detected');
    return {
      success: false,
      error: "Security token already used. Please refresh and try again.",
    };
  }

  const remoteIp =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For') ||
    request.headers.get('X-Real-IP') ||
    'unknown';

  console.log('Validating Turnstile token from IP:', remoteIp);

  const validation = await validateTurnstile(turnstileToken, remoteIp);

  if (!validation.success) {
    console.error('Turnstile validation failed:', validation['error-codes']);
    return {
      success: false,
      error: "Security verification failed. Please try again.",
      errorCodes: validation['error-codes'],
    };
  }

  await markTokenUsed(turnstileToken);
  console.log('✓ Turnstile validation successful from:', validation.hostname);
  return null;
}

async function isTokenUsed(token: string): Promise<boolean> {
  const existing = await prisma.token.findUnique({
    where: { token },
  });
  return !!existing;
}

async function markTokenUsed(token: string): Promise<void> {
  await prisma.token.create({
    data: {
      token,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });
}

export async function cleanupExpiredTurnstileTokens(): Promise<number> {
  const result = await prisma.token.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });
  return result.count;
}