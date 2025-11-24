import { useState } from "react";
import { Form, useNavigation } from "react-router";

export default function LeftPanelDriverRequestForm({ accepted }: any) {
  const [showRequests, setShowRequests] = useState(false);
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";
  const submittingRequestId = navigation.formData?.get("requestId");
  const submittingIntent = navigation.formData?.get("intent");

  const getStatusColor = (status: string) => {
    const colors = {
      Completed: "bg-green-500",
      Accepted: "bg-blue-500",
      "In-Progress": "bg-indigo-500",
      Cancelled: "bg-gray-400",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className="fixed md:absolute bottom-0 left-0 w-full md:bottom-10 md:left-8 z-51 md:z-40 md:w-96 bg-white md:rounded-2xl shadow-xl md:border border-gray-100 overflow-hidden">
      <div
        className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-white cursor-pointer"
        onClick={() => setShowRequests(!showRequests)}
      >
        <h3 className="text-lg font-bold">Active Rides</h3>
        <p className="text-indigo-100 text-sm">
          {accepted.length} ride{accepted.length !== 1 ? "s" : ""} in progress
        </p>
      </div>

      {showRequests && (
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {accepted.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No active rides</p>
            </div>
          ) : (
            accepted.map((ride: any) => {
              const isThisRideSubmitting =
                isSubmitting && submittingRequestId === ride.id;
              const isPickupSubmitting =
                isThisRideSubmitting && submittingIntent === "pickupRequest";
              const isDropoffSubmitting =
                isThisRideSubmitting && submittingIntent === "dropOffRequest";

              return (
                <div
                  key={ride.id}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(ride?.status)}`}
                    >
                      {ride?.status}
                    </span>

                    {ride?.pickedUpAt ? (
                      <span className="text-gray-600 bg-green-200 px-2 rounded-full border border-green-500">
                        {new Date(ride.pickedUpAt).toLocaleString()}
                      </span>
                    ) : ride?.acceptedAt ? (
                      <span className="text-gray-600 bg-green-200 px-2 rounded-full border border-green-500">
                        {new Date(ride.acceptedAt).toLocaleString()}
                      </span>
                    ) : null}
                  </div>

                  <div className=" flex items-center justify-between mb-3 border-b border-gray-200">
                    <div className="">
                      <p className="font-bold text-gray-900">
                        {ride?.user?.firstName} {ride?.user?.lastName}
                      </p>
                      {ride.user?.phoneNumber && (
                        <p className="text-sm text-gray-600">
                          {ride?.user?.phoneNumber}
                        </p>
                      )}
                    </div>

                    <div className="">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-gray-700">
                          {ride?.pickup?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-gray-700">
                          {ride?.dropoff?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!ride?.pickedUpAt && (
                    <Form method="post" action="/dashboard?mode=driver">
                      <input
                        type="hidden"
                        name="intent"
                        value="pickupRequest"
                      />
                      <input type="hidden" name="requestId" value={ride.id} />
                      <input type="hidden" name="userId" value={ride.user.id}/>
                      <button
                        type="submit"
                        disabled={isPickupSubmitting}
                        className="w-full px-4 py-2 font-semibold rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                      >
                        {isPickupSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Confirming...
                          </>
                        ) : (
                          "Confirm Pickup"
                        )}
                      </button>
                    </Form>
                  )}

                  {ride.pickedUpAt && !ride.droppedOffAt && (
                    <Form method="post" action="/dashboard?mode=driver">
                      <input
                        type="hidden"
                        name="intent"
                        value="dropOffRequest"
                      />
                      <input type="hidden" name="requestId" value={ride.id} />
                      <input type="hidden" name="userId" value={ride.user.id}/>
                      <button
                        type="submit"
                        disabled={isDropoffSubmitting}
                        className="w-full px-4 py-2 font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                      >
                        {isDropoffSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Completing...
                          </>
                        ) : (
                          "Complete Drop Off"
                        )}
                      </button>
                    </Form>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
