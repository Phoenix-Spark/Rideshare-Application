import { Link } from "react-router";
import { WarningIcon } from "../Icons/WarningIcon";

export default function MiddlePanelForm({ user, vehicles }: any) {
  const hasBase = !!user?.base?.id;
  const isReset = !!user?.isReset;
  const isDriver = !!user?.isDriver;
  const isVehicle = vehicles;

  const hasVehicleError = isDriver && isVehicle.length === 0;
  const noErrors = hasBase && !isReset;

  if (noErrors) return null;

  return (
    <div className=" fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-3 w-full max-w-md">
      {!hasBase && (
        <Link
          to="/dashboard/settings"
          className="flex w-[500px] items-center gap-3 bg-white text-red-700 px-4 py-3 rounded-lg border border-red-200 shadow-lg animate-in fade-in duration-200 
             hover:bg-red-100 hover:cursor-pointer transition-colors"
        >
          <WarningIcon className="w-5 h-5 text-red-500" />
          <span className="font-medium">
            Click here to select your duty location.
          </span>
        </Link>
      )}

      {hasVehicleError && (
        <Link
          to="/dashboard/settings"
          className="flex w-[500px] items-center gap-3 bg-white text-red-700 px-4 py-3 rounded-lg border border-red-200 shadow-lg animate-in fade-in duration-200 
             hover:bg-red-100 hover:cursor-pointer transition-colors"
        >
          <WarningIcon className="w-5 h-5 text-red-500" />
          <span className="font-medium">
            Driver mode is enabled, add a vehicle to your account.
          </span>
        </Link>
      )}

      {isReset && (
        <Link
          to="/dashboard/settings"
          className="flex w-[500px] items-center gap-3 bg-white text-red-700 px-4 py-3 rounded-lg border border-red-200 shadow-lg animate-in fade-in duration-200
             hover:bg-red-100 hover:cursor-pointer transition-colors"
        >
          <WarningIcon className="w-5 h-5 text-red-500" />
          <span className="font-medium">
            Please create a new password to continue.
          </span>
        </Link>
      )}
    </div>
  );
}
