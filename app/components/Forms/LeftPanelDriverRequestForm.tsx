import { useState } from "react";

export default function LeftPanelDriverRequestForm({ accepted }: any) {
  const [showRequests, setShowRequests] = useState(false);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500 text-white";
      case "Accepted":
        return "bg-blue-500 text-white";
      case "In-Progress":
        return "bg-indigo-500 text-white";
      case "Cancelled":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className={`fixed md:absolute bottom-0 left-0 w-full transition-all md:bottom-10 md:left-8 z-51 md:z-40 md:w-96 bg-white md:rounded-2xl shadow-xl md:border border-gray-100 overflow-hidden`}>
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-white" onClick={() => setShowRequests(!showRequests)}>
        <h3 className="text-lg font-bold">Active Rides</h3>
        <p className="text-indigo-100 text-sm">{accepted.length} ride{accepted.length !== 1 ? 's' : ''} in progress</p>
      </div>

      {showRequests && <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {accepted.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">No active rides</p>
          </div>
        ) : (
          accepted.map((ride: any) => (
            <div
              key={ride.id}
              className="bg-gradient-to-br from-gray-50 to-blue-50/50 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusBadgeClass(
                    ride.status
                  )}`}
                >
                  {ride.status}
                </span>
              </div>

              <div className="mb-3 pb-3 border-b border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Passenger</p>
                <p className="text-gray-900 font-bold text-base">
                  {ride.user?.firstName || ""} {ride.user?.lastName || ""}
                </p>
                {ride.user?.phoneNumber && (
                  <p className="text-gray-600 text-sm mt-0.5">{ride.user.phoneNumber}</p>
                )}
              </div>

              <div className="mb-3 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="mt-1 w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Pickup</p>
                    <p className="text-sm font-semibold text-gray-800">{ride.pickup?.name || "Unknown"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 flex justify-center">
                    <div className="w-0.5 h-4 bg-gray-300"></div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-1 w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Dropoff</p>
                    <p className="text-sm font-semibold text-gray-800">{ride.dropoff?.name || "Unknown"}</p>
                  </div>
                </div>
              </div>

              {(ride.pickedUpAt || ride.droppedOffAt) && (
                <div className="mb-3 text-xs text-gray-500 space-y-1 bg-white/50 p-2 rounded-lg">
                  {ride.pickedUpAt && (
                    <p>✓ Picked up: {new Date(ride.pickedUpAt).toLocaleTimeString()}</p>
                  )}
                  {ride.droppedOffAt && (
                    <p>✓ Dropped off: {new Date(ride.droppedOffAt).toLocaleTimeString()}</p>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                {!ride.pickedUpAt && (
                  <form method="post" action="/dashboard?mode=driver" className="flex-1">
                    <input type="hidden" name="intent" value="pickupRequest" />
                    <input type="hidden" name="requestId" value={ride.id} />
                    <button
                      type="submit"
                      className="w-full px-4 py-2.5 font-semibold rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
                    >
                      Confirm Pickup
                    </button>
                  </form>
                )}
                {ride.pickedUpAt && !ride.droppedOffAt && (
                  <form method="post" action="/dashboard?mode=driver" className="flex-1">
                    <input type="hidden" name="intent" value="dropOffRequest" />
                    <input type="hidden" name="requestId" value={ride.id} />
                    <button
                      type="submit"
                      className="w-full px-4 py-2.5 font-semibold rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
                    >
                      Complete Drop Off
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))
        )}
      </div>}
    </div>
  );
}