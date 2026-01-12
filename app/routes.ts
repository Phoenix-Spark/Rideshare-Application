import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/entry.tsx"),
    route("/login", "./routes/auth/login.tsx"),
    route("/logout", "./routes/auth/logout.tsx"),
    route("/register", "./routes/auth/register.tsx"),
    route("/send", "./routes/auth/send.tsx"),
    route("/verify", "./routes/auth/verify.tsx"),
    route("/api/sse", "./routes/api/sse.ts"),
    route("/dashboard", "./routes/dashboard/dashboard.tsx", [
        route("settings", "./routes/settings/usersettings.tsx"),
        route("admin", "./routes/settings/adminsettings.tsx"),
    ]),
    route("/broadcast/sse", "./hooks/broadcast.sse.ts"),
    route("*", './routes/notfound.tsx'),

] satisfies RouteConfig;
