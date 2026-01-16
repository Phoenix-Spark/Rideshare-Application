interface TurnstileValidationError {
  success: false;
  error: string;
  errorCodes?: string[];
}

/**
 * SERVER-ONLY: Validates Turnstile token with Cloudflare
 */
async function validateTurnstileToken(token: string, remoteip: string) {
  const secret = process.env.CF_SECRET;

  if (!secret) {
    console.error('❌ CF_SECRET environment variable not set');
    throw new Error('Turnstile secret not configured');
  }

  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);
  formData.append('remoteip', remoteip);

  console.log('🔐 Validating Turnstile token for IP:', remoteip);

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();
    
    console.log('Turnstile API response:', {
      success: result.success,
      errorCodes: result['error-codes'],
      hostname: result.hostname,
    });

    return result;
  } catch (error) {
    console.error('❌ Turnstile validation error:', error);
    return { success: false, 'error-codes': ['internal-error'] };
  }
}

/**
 * Validates Turnstile token from formData
 * @returns null if valid, error object if invalid
 */
export async function validateTurnstileFromFormData(
  formData: FormData,
  request: Request
): Promise<TurnstileValidationError | null> {
  const turnstileToken = formData.get('cf-turnstile-response') as string;

  console.log('🎫 Turnstile token present:', !!turnstileToken);

  if (!turnstileToken) {
    return {
      success: false,
      error: "Security verification missing. Please complete the verification.",
    };
  }

  // Extract real IP (prioritize Cloudflare header)
  const remoteIp =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0].trim() ||
    request.headers.get('X-Real-IP') ||
    'unknown';

  // Validate with Cloudflare
  const validation = await validateTurnstileToken(turnstileToken, remoteIp);

  if (!validation.success) {
    console.error('❌ Turnstile validation failed:', validation['error-codes']);
    return {
      success: false,
      error: "Security verification failed. Please try again.",
      errorCodes: validation['error-codes'],
    };
  }

  console.log('✅ Turnstile validation successful');
  return null; // Success
}