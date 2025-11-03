import { BaseBoundIcon } from "../Icons/BaseBoundIcon";

export default function LeftSideRidePanel() {
  return (
    <div className="absolute top-8 left-8 z-50 w-96 bg-white bg-opacity-95 rounded-2xl shadow-2xl border border-gray-200 flex flex-col backdrop-blur-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
            <BaseBoundIcon className="size-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Base Bound</h1>
            <p className="text-xs text-gray-500">Available Rides</p>
          </div>
        </div>

        <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-semibold text-white transition-all shadow-lg shadow-blue-500/30">
          Request a Ride
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/**Pickup location goes here! */}
      </div>
    </div>
  );
}
