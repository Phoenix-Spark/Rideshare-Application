import { Form, useNavigation } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import { displayName } from "../Utilities/formatName";

export default function LeftPanelDriverRequestForm({ accepted, userId }: any) {
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
    <div className="md:fixed md:bottom-10 md:left-8 md:z-40 md:w-96 w-full bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Active Rides</h3>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
            {accepted.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
        {accepted.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">No active rides</p>
          </div>
        ) : (
          accepted.map((ride: any) => {
            const isThisRideSubmitting = isSubmitting && submittingRequestId === ride.id;
            const isPickupSubmitting = isThisRideSubmitting && submittingIntent === "pickupRequest";
            const isDropoffSubmitting = isThisRideSubmitting && submittingIntent === "dropOffRequest";
            const isCancelSubmitting = isThisRideSubmitting && submittingIntent === "cancelAcceptedRequest";
            
            // Show cancel button unless ride is completed or cancelled
            const showCancelButton = ride?.status !== "Completed" && ride?.status !== "Cancelled";

            return (
              <div key={ride.id} className=" rounded-xl ">
                {/* Status and Time */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${getStatusColor(ride?.status)}`}>
                    {ride?.status}
                  </span>
                  {ride?.pickedUpAt ? (
                    <span className="text-xs text-gray-600 bg-green-100 px-2 py-0.5 rounded-full">
                      {new Date(ride.pickedUpAt).toLocaleString()}
                    </span>
                  ) : ride?.acceptedAt ? (
                    <span className="text-xs text-gray-600 bg-green-100 px-2 py-0.5 rounded-full">
                      {new Date(ride.acceptedAt).toLocaleString()}
                    </span>
                  ) : null}
                </div>

                {/* Two Column Layout: Passenger Info & Locations */}
                <div className="flex gap-3 mb-3 pb-2 ">
                  {/* Left: Passenger */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">
                      {displayName(ride?.user?.firstName, ride?.user?.lastName)}
                    </p>
                    {ride.user?.phoneNumber && (
                      <a
                        href={`sms:${ride.user.phoneNumber}`}
                        className="text-xs text-indigo-600 underline truncate"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {ride.user.phoneNumber}
                      </a>
                    )}
                  </div>

                  {/* Right: Locations */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="text-xs text-gray-700 truncate">{ride?.pickup?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      <span className="text-xs text-gray-700 truncate">{ride?.dropoff?.name}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {!ride?.pickedUpAt && (
                  <div className="flex gap-2">
                    <Form method="post" action="/dashboard?mode=driver" className="flex-1">
                      <AuthenticityTokenInput />
                      <input type="hidden" name="intent" value="pickupRequest" />
                      <input type="hidden" name="requestId" value={ride.id} />
                      <input type="hidden" name="userId" value={ride.user.id} />
                      <button
                        type="submit"
                        name="submit"
                        value="confirm"
                        disabled={isPickupSubmitting}
                        className="w-full px-3 py-2 min-h-[44px] font-semibold text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-1.5"
                      >
                        {isPickupSubmitting ? (
                          <>
                            <div className="w-3 h-3 rounded-full animate-spin" />
                            Confirming...
                          </>
                        ) : (
                          "Confirm Pickup"
                        )}
                      </button>
                    </Form>
                    {showCancelButton && (
                      <Form method="post" action="/dashboard?mode=driver">
                        <AuthenticityTokenInput />
                        <input type="hidden" name="intent" value="cancelAcceptedRequest" />
                        <input type="hidden" name="requestId" value={ride.id} />
                        <input type="hidden" name="userId" value={userId} />
                        <button 
                          type="submit" 
                          disabled={isCancelSubmitting}
                          className="px-3 py-2 min-h-[44px] font-semibold text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          {isCancelSubmitting ? "..." : "Cancel"}
                        </button>
                      </Form>
                    )}
                  </div>
                )}

                {ride.pickedUpAt && !ride.droppedOffAt && (
                  <div className="flex gap-2">
                    <Form method="post" action="/dashboard?mode=driver" className="flex-1">
                      <AuthenticityTokenInput />
                      <input type="hidden" name="intent" value="dropOffRequest" />
                      <input type="hidden" name="requestId" value={ride.id} />
                      <input type="hidden" name="userId" value={userId} />
                      <button
                        type="submit"
                        disabled={isDropoffSubmitting}
                        className="w-full px-3 py-2 min-h-[44px] font-semibold text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-1.5"
                      >
                        {isDropoffSubmitting ? (
                          <>
                            <div className="w-3 h-3 rounded-full animate-spin" />
                            Completing...
                          </>
                        ) : (
                          "Complete Drop Off"
                        )}
                      </button>
                    </Form>
                    {showCancelButton && (
                      <Form method="post" action="/dashboard?mode=driver">
                        <AuthenticityTokenInput />
                        <input type="hidden" name="intent" value="cancelAcceptedRequest" />
                        <input type="hidden" name="requestId" value={ride.id} />
                        <input type="hidden" name="userId" value={userId} />
                        <button 
                          type="submit" 
                          disabled={isCancelSubmitting}
                          className="px-3 py-2 min-h-[44px] font-semibold text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          {isCancelSubmitting ? "..." : "Cancel"}
                        </button>
                      </Form>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}