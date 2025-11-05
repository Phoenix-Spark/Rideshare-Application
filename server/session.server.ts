import { createCookieSessionStorage, redirect } from "react-router";
import { prisma } from "./db.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set in environment variables");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
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
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
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
  const userId = await getUserId(request);

  if (!userId) {
    throw redirect(redirectTo);
  }

  return userId;
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
