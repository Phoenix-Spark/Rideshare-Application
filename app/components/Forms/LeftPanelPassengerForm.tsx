import { useState } from "react";
import { Form } from "react-router";
import { MapPinIcon } from "../Icons/MapPinIcon";
import { NavigationIcon } from "../Icons/NavigationIcon";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";

export default function LeftSidePassengerForm({ user, station, params }: any) {
  const [fromLocation, setFromLocation] = useState(params?.pickupId ?? "");
  const [toLocation, setToLocation] = useState(params?.dropoffId ?? "");

  const isButtonEnabled =
    !user?.isReset &&
    !!user?.base?.id &&
    fromLocation &&
    toLocation &&
    fromLocation !== toLocation;

  return (
    <Form method="post" >
      <AuthenticityTokenInput />
      <input type="hidden" name="intent" value="createRequest" />
      <input type="hidden" name="userId" value={user?.id} />
      <input type="hidden" name="baseId" value={user?.base?.id} />

      <div className="space-y-4 mb-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Pickup Location
          </label>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
            <select
              name="pickupId"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="">Select pickup location...</option>
              {station.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Dropoff Location
          </label>
          <div className="relative">
            <NavigationIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
            <select
              name="dropoffId"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="">Select dropoff location...</option>
              {station
                .filter((s: any) => s.id !== fromLocation)
                .map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isButtonEnabled}
        className={`w-full py-2 rounded font-semibold text-white ${
          isButtonEnabled
            ? "bg-blue-700 hover:bg-blue-800"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Request Ride
      </button>

      {!isButtonEnabled && (
        <div className="text-sm text-gray-800 text-center">
        </div>
      )}
    </Form>
  );
}
