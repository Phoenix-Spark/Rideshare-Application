import { useState } from "react";
import { BaseBoundIcon } from "../Icons/BaseBoundIcon";
import { MapPinIcon } from "../Icons/MapPinIcon";
import { NavigationIcon } from "../Icons/NavigationIcon";
import LeftPanelRequestsForm from "./LeftPanelRequestsForm";

export default function LeftSideRidePanelForm({ user, station, requestInfo }: any) {
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

  const LocationSelect = ({
    label,
    value,
    onChange,
    excludeId,
    icon: Icon,
    name,
  }: any) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer hover:bg-gray-100"
        >
          <option value="">Select {label.toLowerCase()}...</option>
          {station
            .filter((s: any) => s.id !== excludeId)
            .map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );

  return (
    <>
      <div className="absolute top-8 left-8 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white flex items-center gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
            <BaseBoundIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Base Bound</h1>
            <p className="text-blue-100 text-sm">Request Your Ride</p>
          </div>
        </div>

        <div className="p-6">
          <form method="post" action="/dashboard">
            <input type="hidden" name="intent" value="requestPickup" />
            <input type="hidden" name="userId" value={user?.id} />

            <div className="space-y-4 mb-6 text-gray-700">
              <LocationSelect
                label="Pickup Location"
                value={fromLocation}
                onChange={(e: any) => setFromLocation(e.target.value)}
                excludeId=""
                icon={MapPinIcon}
                name="pickupId"
              />
              <LocationSelect
                label="Dropoff Location"
                value={toLocation}
                onChange={(e: any) => setToLocation(e.target.value)}
                excludeId={fromLocation}
                icon={NavigationIcon}
                name="dropoffId"
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
        </div>
      </div>

      <LeftPanelRequestsForm requestInfo={requestInfo}/>
    </>
  );
}
