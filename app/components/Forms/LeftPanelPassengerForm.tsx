import { useState } from "react";
import LocationSelect from "../Input/LocationSelect";
import { MapPinIcon } from "../Icons/MapPinIcon";
import { NavigationIcon } from "../Icons/NavigationIcon";

export default function LeftSidePassengerForm({ user, station, setShowMain }: any) {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");

  const isButtonEnabled =
    !user?.isReset &&
    !!user?.baseId &&
    fromLocation &&
    toLocation &&
    fromLocation !== toLocation;

  const getDisabledReason = () => {
    if (user?.isReset) return "Please create a new password to continue.";
    if (!user?.baseId) return "Please choose a base to continue.";
    if (!fromLocation || !toLocation)
      return "Select both pickup and dropoff locations.";
    if (fromLocation === toLocation)
      return "Pickup and dropoff cannot be the same.";
    return "";
  };

  return (
    <>
      <form method="post" action="/dashboard?mode=passenger">
        <input type="hidden" name="intent" value="requestPickup" />
        <input type="hidden" name="userId" value={user?.id} />
        <input type="hidden" name="baseId" value={user?.baseId} />

        <div className="space-y-4 mb-6 text-gray-700">
          <LocationSelect
            label="Pickup Location"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            options={station}
            excludeId=""
            icon={MapPinIcon}
            name="pickupId"
            setShowMain={setShowMain}
          />

          <LocationSelect
            label="Dropoff Location"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            options={station}
            excludeId={fromLocation}
            icon={NavigationIcon}
            name="dropoffId"
            setShowMain={setShowMain}
          />
        </div>

        <button
          type="submit"
          disabled={!isButtonEnabled}
          className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 ${
            isButtonEnabled
              ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] cursor-pointer"
              : "bg-gray-300 cursor-not-allowed opacity-60"
          }`}
          title={getDisabledReason()}
        >
          Request Ride
        </button>

        {!isButtonEnabled && (
          <p className="text-center text-sm text-gray-500 mt-3">
            {getDisabledReason()}
          </p>
        )}
      </form>
    </>
  );
}
