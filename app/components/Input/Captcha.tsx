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

// ❌ DELETE THE validateTurnstile FUNCTION - IT SHOULD NOT BE HERE!
// Validation MUST happen server-side only

export default function Captcha({ 
  turnstileToken, 
  setTurnstileToken, 
  error, 
  setError 
}: CaptchaProps) {
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const hasRenderedRef = useRef(false);

  useEffect(() => {
    if (hasRenderedRef.current) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const renderWidget = () => {
      if (!window.turnstile || !turnstileRef.current || widgetIdRef.current) return;

      hasRenderedRef.current = true;

      try {
        const sitekey = import.meta.env.VITE_CF_SITEKEY;
        
        if (!sitekey) {
          console.error('VITE_CF_SITEKEY not set');
          setError("Configuration error");
          return;
        }

        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey,
          appearance: "always",
          theme: "auto",
          callback: (token: string) => {
            console.log('✓ Turnstile token received');
            setTurnstileToken(token);
            setError(null);
          },
          "error-callback": () => {
            console.error('✗ Turnstile error');
            setError("Verification failed. Please try again.");
          },
        });
      } catch (e) {
        console.error('Failed to render Turnstile:', e);
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
  }, [setTurnstileToken, setError]);

  return (
    <div className="pt-2">
      <div ref={turnstileRef} className="flex justify-center" />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <input type="hidden" name="cf-turnstile-response" value={turnstileToken || ""} />
    </div>
  );
}