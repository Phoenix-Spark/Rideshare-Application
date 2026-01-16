// server/utils/turnstile.server.ts
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

  // Check token presence
  if (!turnstileToken) {
    return {
      success: false,
      error: "Security verification missing. Please complete the verification.",
    };
  }

  // Get remote IP
  const remoteIp =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For') ||
    request.headers.get('X-Real-IP') ||
    'unknown';

  // Validate with Cloudflare
  const validation = await validateTurnstile(turnstileToken, remoteIp);

  if (!validation.success) {
    return {
      success: false,
      error: "Security verification failed. Please try again.",
      errorCodes: validation['error-codes'],
    };
  }

  // Return null = success
  return null;
}
