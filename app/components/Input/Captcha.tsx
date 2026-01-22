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
          "expired-callback"?: () => void;
          appearance?: "always" | "execute" | "interaction-only";
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

interface CaptchaProps {
  turnstileToken: string | null;
  setTurnstileToken: (token: string | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  show?: boolean;
}

export default function Captcha({
  turnstileToken,
  setTurnstileToken,
  error,
  setError,
  show = true,
}: CaptchaProps) {
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!show) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const renderWidget = () => {
      if (!window.turnstile || !turnstileRef.current) return;

      // Remove existing widget if any
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // ignore
        }
        widgetIdRef.current = null;
      }

      try {
        const sitekey = import.meta.env.VITE_CF_SITEKEY;

        if (!sitekey) {
          console.error("VITE_CF_SITEKEY not set");
          setError("Configuration error");
          return;
        }

        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey,
          appearance: "always",
          theme: "auto",
          callback: (token: string) => {
            setTurnstileToken(token);
            setError(null);
          },
          "error-callback": () => {
            setError("Verification failed. Please try again.");
          },
          "expired-callback": () => {
            setTurnstileToken(null);
            setError("Verification expired. Please try again.");
          },
        });
      } catch (e) {
        console.error("Failed to render Turnstile:", e);
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
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [show, setTurnstileToken, setError]);

  if (!show) {
    return <input type="hidden" name="cf-turnstile-response" value="" />;
  }

  return (
    <div className="pt-2">
      <div ref={turnstileRef} className="flex justify-center" />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <input type="hidden" name="cf-turnstile-response" value={turnstileToken || ""} />
    </div>
  );
}
