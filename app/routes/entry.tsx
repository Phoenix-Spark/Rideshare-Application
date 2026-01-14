import DebugPanel from "~/components/Pages/DebugPanel";
import type { Route } from "./+types/entry";
import { ErrorBoundary } from "./auth/login";
import MainLanding from "~/components/Pages/landing";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Travis AFB: Base Bound" },
    { name: "Travis AFB: Base Bound", content: "" },
  ];
}

export default function Entry() {
  return (
    <div className="overflow-y-scroll">
      <DebugPanel />
      <MainLanding />
    </div>
  );
}

export { ErrorBoundary };