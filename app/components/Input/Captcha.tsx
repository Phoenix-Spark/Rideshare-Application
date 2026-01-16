import { useRef, useEffect } from "react";

declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          appearance?: "always";
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

interface CaptchaProps {
  turnstileToken: string | null;
  setTurnstileToken: (token: string | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

// Turnstile validation function
export async function validateTurnstile(token: string, remoteip: string) {
  const formData = new FormData();
  const key = process.env.VITE_CF_SECRET || process.env.CF_SECRET
  formData.append('secret', key!); // ✓ Fixed: removed VITE_ prefix
  formData.append('response', token); // ✓ Fixed: was 'reponse'
  formData.append('remoteip', remoteip);

  try {
    const response = await fetch( // ✓ Fixed: was 'reponse'
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, 'error-codes': ['internal-error'] };
  }
}

export default function Captcha({ turnstileToken, setTurnstileToken, error, setError }: CaptchaProps) {
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const hasRenderedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple render attempts
    if (hasRenderedRef.current) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const renderWidget = () => {
      if (!window.turnstile || !turnstileRef.current || widgetIdRef.current) return;

      hasRenderedRef.current = true;

      try {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: import.meta.env.VITE_CF_SITEKEY || import.meta.env.CF_SITEKEY,//"1x00000000000000000000AA",
          appearance: "always",
          theme: "auto",
          callback: (token: string) => {
            setTurnstileToken(token);
            setError(null);
          },
          "error-callback": () => {
            setError("Verification failed. Please try again.");
          },
        });
      } catch (e) {
        setError("Failed to load verification widget.");
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      interval = setInterval(() => {
        if (window.turnstile) {
          if (interval) clearInterval(interval);
          renderWidget();
        }
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pt-2 ">
      <div ref={turnstileRef} className="flex justify-center" />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <input type="hidden" name="cf-turnstile-response" value={turnstileToken || ""} />
    </div>
  );
}