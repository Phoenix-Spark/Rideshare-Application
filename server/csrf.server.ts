import { CSRF } from "remix-utils/csrf/server";
import { createCookie } from "react-router";

export const cookie = createCookie("csrf", {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  secrets: [process.env.SESSION_SECRET || "330749e96c6da2284d8e50119bb6175b"],
});

export const csrf = new CSRF({
  cookie,
  formDataKey: "csrf",
  secret: process.env.CSRF_SECRET || "0994f696fb000f1143a54554025fdfa3",
});