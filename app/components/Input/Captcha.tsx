import { useState, useRef, useEffect } from "react";

declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          appearance?: "always" | "interaction-only";
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

export default function Captcha({turnstileToken, setTurnstileToken, error, setError}: any) {
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  console.log("Current hostname:", window.location.hostname);
  console.log("Current origin:", window.location.origin);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const renderWidget = () => {
      if (!window.turnstile || !turnstileRef.current || widgetIdRef.current) return;

      try {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: import.meta.env.VITE_CF_SITEKEY || "3x00000000000000000000FF",
          appearance: "interaction-only", // ✅ Add this here
          theme: "auto", // Optional: auto, light, or dark
          callback: (token: string) => {
            setTurnstileToken(token);
            setError(null);
          },
          "error-callback": () => {
            setError("Verification failed. Please try again.");
          },
        });
      } catch (e) {
        console.error("Turnstile render error:", e);
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
          // Ignore cleanup errors
        }
        widgetIdRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Security Verification
      </label>
      <div ref={turnstileRef} className="flex justify-center" />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <input type="hidden" name="cf-turnstile-response" value={turnstileToken || ""} />
    </div>
  );
}