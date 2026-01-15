import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useLoaderData,
  type HeadersFunction,
} from "react-router";
import { ToastContainer } from "react-toastify";
import { AuthenticityTokenProvider } from "remix-utils/csrf/react";
import { csrf } from "server/csrf.server";
import type { Route } from "./+types/root";
import "./app.css";

export async function loader({ request }: Route.LoaderArgs) {
  const nonce = Array.from(
    crypto.getRandomValues(new Uint8Array(16)),
    (byte) => byte.toString(16).padStart(2, "0")
  ).join("");

  const [token, cookieHeader] = await csrf.commitToken(request);

  const headers = new Headers();
  if (cookieHeader) {
    headers.set("Set-Cookie", cookieHeader);
  }

  return Response.json(
    {
      nonce,
      csrf: token,
    },
    { headers }
  );
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  const setCookie = loaderHeaders.get("set-cookie");

  const headers: Record<string, string> = {
    "Content-Security-Policy": [
      "default-src 'self'",
      // Note: 'unsafe-inline' is required for React Router v7 hydration scripts
      // This is acceptable when combined with other security measures (CSRF tokens, strict headers)
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net ",
      "font-src 'self' https://fonts.gstatic.com ",
      "img-src 'self' data: https://tile.openstreetmap.org",
      // Allow WebSocket from any origin for network IP access
      "connect-src 'self' ws: wss: https://tile.openstreetmap.org",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), camera=(), microphone=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
    "Pragma": "no-cache",
    "Expires": "0",
    "Cross-Origin-Embedder-Policy": "credentialless",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "cross-origin",
    "X-Permitted-Cross-Domain-Policies": "none",
  };

  if (setCookie) {
    headers["Set-Cookie"] = setCookie;
  }

  return headers;
};

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/react-toastify@10/dist/ReactToastify.min.css",
    crossOrigin: "anonymous",
    integrity: "sha384-JnCg6eF8GhEGjdkqwV7E+UMYiG+IyoLTJbZYuNlVJ7QufeimSsCeUvy0dBRehb4T",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const allowScroll = isLandingPage || isAuthPage;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <s
        <Meta />
        <Links />
      </head>
      <body
        className={`w-screen h-screen ${
          allowScroll ? "overflow-y-scroll" : "overflow-hidden"
        }`}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { csrf } = useLoaderData<typeof loader>();

  return (
    <AuthenticityTokenProvider token={csrf}>
      <div>
        <ToastContainer position="top-center" />
        <Outlet />
      </div>
    </AuthenticityTokenProvider>
  );
}