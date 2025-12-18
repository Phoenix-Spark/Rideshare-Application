import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  type HeadersFunction,
} from "react-router";
import { ToastContainer } from "react-toastify";
import type { Route } from "./+types/root";
import "./app.css";
import crypto from "crypto";

export const headers: HeadersFunction = () => {
  const WS_URL = process.env.WS_URL || "ws://localhost:3001";

  const nonce = crypto.randomBytes(16).toString("base64");

  return {
    "Content-Security-Policy": [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}'`,
      `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com https://cdn.jsdelivr.net`,
      "font-src 'self' https://fonts.gstatic.com",
      `img-src 'self' data: https://tile.openstreetmap.org`,
      `connect-src 'self' ${WS_URL} https://tile.openstreetmap.org`,
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), camera=(), microphone=()",
    "X-Content-Security-Nonce": nonce,
  };
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
  },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/react-toastify@10/dist/ReactToastify.min.css",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={`w-screen h-screen ${
          isLandingPage ? "overflow-y-scroll" : "overflow-hidden"
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
  return (
    <div>
      <ToastContainer position="top-center" />
      <Outlet />
    </div>
  );
}
