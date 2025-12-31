import { useEffect, useState } from "react";
import { ClockIcon } from "../Icons/ClockIcon";
import { UserIcon } from "../Icons/UserIcon";
import { Form } from "react-router";

export default function LeftPanelRequestsForm({ requestInfo }: any) {
  if (!requestInfo) requestInfo = [];
  const [showRequests, setShowRequests] = useState(false);

  const statusPriority: Record<string, number> = {
    Accepted: 1,
    Pending: 2,
    Completed: 3,
    Cancelled: 4,
    Expired: 5,
  };

  const sortedRequests = [...requestInfo].sort((a, b) => {
    const aPriority = statusPriority[a.status] || 999;
    const bPriority = statusPriority[b.status] || 999;
    return aPriority - bPriority;
  });

  const formatCountdown = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const RequestItem = ({ request }: any) => {
    const [expanded, setExpanded] = useState(request.status === "Accepted");
    const [timeLeft, setTimeLeft] = useState<number>(() => {
      const expiration = new Date(request.createdAt).getTime() + 15 * 60 * 1000;
      return Math.max(0, expiration - Date.now());
    });

    const isActiveOrPending =
      request.status === "Accepted" || request.status === "Pending";

    useEffect(() => {
      if (!isActiveOrPending) return;

      const expiration = new Date(request.createdAt).getTime() + 15 * 60 * 1000;

      const interval = setInterval(() => {
        const now = Date.now();
        setTimeLeft(Math.max(0, expiration - now));
      }, 1000);

      return () => clearInterval(interval);
    }, [request.createdAt, isActiveOrPending]);

    const isEndingSoon = timeLeft > 0 && timeLeft <= 30 * 1000;

    const getStatusBadge = () => {
      const baseClass =
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";

      switch (request.status) {
        case "Completed":
          return (
            <span className={`${baseClass} bg-green-100 text-green-700`}>
              Completed
            </span>
          );
        case "Accepted":
          return (
            <span className={`${baseClass} bg-blue-100 text-blue-700`}>
              Accepted
            </span>
          );
        case "In-Progress":
          return (
            <span className={`${baseClass} bg-blue-200 text-blue-800`}>
              In-Progress
            </span>
          );
        case "Pending":
          return (
            <span className={`${baseClass} bg-amber-100 text-amber-700`}>
              Pending
            </span>
          );
        case "Expired":
          return (
            <span className={`${baseClass} bg-red-100 text-red-700`}>
              Expired
            </span>
          );
        case "Cancelled":
          return (
            <span className={`${baseClass} bg-gray-200 text-gray-500`}>
              Cancelled
            </span>
          );
        default:
          return (
            <span className={`${baseClass} bg-gray-100 text-gray-600`}>
              Unknown
            </span>
          );
      }
    };

    return (
      <div className="transition-all">
        {!expanded ? (
          <div
            className="p-3 bg-gray-50 flex justify-between items-center cursor-pointer rounded-xl hover:shadow"
            onClick={() => setExpanded(true)}
          >
            <p className="text-sm font-medium text-gray-900 truncate">
              {request.pickup.name} {"-> "}{request.dropoff.name}
            </p>
            <div className="flex items-center gap-2">{getStatusBadge()}</div>
          </div>
        ) : (
          <Form
            method="post"
            action="/dashboard?mode=passenger"
            key={request.id}
            className="bg-white p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
          >
            <input type="hidden" name="intent" value="cancelRequest" />
            <input type="hidden" name="requestId" value={request.id} />
            <input type="hidden" name="driverId" value={request.driverId} />

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <div
                className="flex-1 min-w-0 cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 -my-1 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(false);
                }}
              >
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {request.user.firstName} {request.user.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {request.user.phoneNumber || "No phone"}
                </p>
              </div>

              {/* {isActiveOrPending && timeLeft > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <ClockIcon
                    className={`w-5 h-5 ${isEndingSoon ? "text-red-500" : "text-gray-500"}`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isEndingSoon ? "text-red-500" : "text-gray-700"
                    }`}
                  >
                    {formatCountdown(timeLeft)}
                  </span>
                </div>
              )} */}
            </div>

            <div className="space-y-2">
              {["pickup", "dropoff"].map((type) => (
                <div key={type} className="flex items-start gap-2">
                  <div
                    className={`w-2 h-2 rounded-full mt-1 ${
                      type === "pickup" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 capitalize">{type}</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {request[type]?.name || "Unknown"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {request.driver && (
              <div className="mt-3 text-xs text-gray-500 space-y-1">
                <p>
                  <span className="font-medium text-gray-700">Driver:</span>{" "}
                  {request.driver.firstName} {request.driver.lastName}{" "}
                  {request.driver.phoneNumber &&
                    `${request.driver.phoneNumber}`}
                </p>
                {request.vehicle && (
                  <p>
                    <span className="font-medium text-gray-700">Vehicle:</span>{" "}
                    {[
                      request.vehicle.year,
                      request.vehicle.make,
                      request.vehicle.model,
                      request.vehicle.color,
                      request.vehicle.plate,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </p>
                )}
              </div>
            )}

            {request.pickedUpAt && (
              <p className="mt-1 text-xs text-gray-500">
                <span className="font-medium text-gray-700">Picked up:</span>{" "}
                {new Date(request.pickedUpAt).toLocaleString()}
              </p>
            )}
            {request.droppedOffAt && (
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-700">Dropped off:</span>{" "}
                {new Date(request.droppedOffAt).toLocaleString()}
              </p>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              {getStatusBadge()}

              {isActiveOrPending ? (
                timeLeft > 0 ? (
                  <button
                    type="submit"
                    className="px-4 py-2.5 min-h-[44px] font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Cancel Request
                  </button>
                ) : (
                  <span className="text-xs text-gray-400">Expired</span>
                )
              ) : null}
            </div>
          </Form>
        )}
      </div>
    );
  };

  return (
    <div
      className={`md:fixed transition-all md:bottom-10 md:left-8 md:z-40 ${showRequests ? "max-h-80" : ""} md:w-96 w-full bg-white rounded-2xl md:shadow-xl md:border border border-gray-200 md:border-gray-100 overflow-hidden`}
    >
      <div
        className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-white flex"
        onClick={() => setShowRequests(!showRequests)}
      >
        <div className="flex w-full justify-between items-center ">
          <h3 className="text-lg font-semibold">Requests</h3>

          {requestInfo.length > 0 &&
            requestInfo.some(
              (r: any) => r.status === "Accepted" || r.status === "Pending"
            ) && (
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {
                  requestInfo.filter(
                    (r: any) =>
                      r.status === "Accepted" || r.status === "Pending"
                  ).length
                }
              </span>
            )}
        </div>
      </div>

      {showRequests && (
        <div className="max-h-64 overflow-y-auto p-4 space-y-3">
          {sortedRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <ClockIcon className="w-6 h-6" />
              </div>
              <p className="text-sm">No requests</p>
            </div>
          ) : (
            sortedRequests.map((request) => (
              <RequestItem key={request.id} request={request} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
