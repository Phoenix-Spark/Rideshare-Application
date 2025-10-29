import type { Route } from "./+types/entry";
import Login from "./auth/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Travis AFB: Base Bound" },
    { name: "Travis AFB: Base Bound", content: "" },
  ];
}

export default function Entry() {
  return (
    <div>
      <Login />
    </div>
  );
}
