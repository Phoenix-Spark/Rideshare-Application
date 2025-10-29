import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/entry.tsx"),
    route("/login", "./routes/auth/login.tsx"),
    route("/logout", "./routes/auth/logout.tsx"),
    route("/register", "./routes/auth/register.tsx"),

] satisfies RouteConfig;
