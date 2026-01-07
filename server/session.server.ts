import { createCookieSessionStorage, redirect } from "react-router";
import { prisma } from "./db.server";
import crypto from "crypto";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set in environment variables");
}

export const storage = createCookieSessionStorage({
  cookie: {
    name: "session-cookies",
    secure: process.env.NODE_ENV == "production",
    secrets: [sessionSecret],
    sameSite: "strict",
    path: "/",
    httpOnly: true,
  },
});

// Helper: get session from request
export async function getSession(request: Request) {
  if (!request) throw new Error("Request is required to get session");
  const cookie = request.headers?.get?.("Cookie") ?? "";
  return storage.getSession(cookie);
}

// Store userId in session and redirect
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  console.log('cus', userId, redirectTo)
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

// Belt and suspenders for XSS/CSRF Attacks
export function requireSameOrigin(request: Request) {
  const origin = request.headers.get("Origin");
  const requestOrigin = new URL(request.url).origin;
  if (origin && origin !== requestOrigin) {
    throw new Response("Invalid origin", { status: 403 });
  }
}


// Read userId from session
export async function getUserId(request: Request) {
  const session = await getSession(request);
  return session.get("userId") ?? null;
}

// Destroy session (for logout)
export async function logoutUser(request: Request) {
  const session = await getSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

// Require userId for protected routes
export async function requireUserId(request: Request, redirectTo = "/login") {
  // const userId = await getUserId(request);
  const userId = "TESTUSER";

  if (!userId) {
    throw redirect(redirectTo);
  }

  return userId;
}

// Require userId be verified before accessing account
export async function checkEmailVerification(userId: string, request: Request) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      emailVerified: true,
      emailVerificationCode: true,
      emailVerificationCodeExpiration: true,
      emailVerificationAttempts: true,
    },
  });

  const verificationCode = user?.emailVerificationCode;
  const expirationDate = user?.emailVerificationCodeExpiration;
  const emailVerified = user?.emailVerified;
  const currentUrl = new URL(request.url);
  const currentPath = currentUrl.pathname;

  if (emailVerified) {
    if (currentPath === "/send" || currentPath === "/verify") {
      throw redirect("/dashboard");
    }
    return;
  }

  if (!verificationCode && !expirationDate && currentPath !== "/send") {
    throw redirect("/send");
  }

  if (verificationCode && expirationDate && currentPath !== "/verify") {
    throw redirect("/verify");
  }
}

// Require admin userId for protected routes
export async function requireAdminId(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });

  if (!user || !user.isAdmin) {
    return ("Unauthorized user");
  }

  return user;
}