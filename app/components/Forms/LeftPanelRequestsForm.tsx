import { useEffect, useState } from "react";
import { ClockIcon } from "../Icons/ClockIcon";
import { UserIcon } from "../Icons/UserIcon";
import { Form } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";

export default function LeftPanelRequestsForm({ requestInfo }: any) {
  if (!requestInfo) requestInfo = [];

  const statusPriority: Record<string, number> = {
    Active: 1,
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

  const RequestItem = ({ request }: any) => {
    const [expanded, setExpanded] = useState(request.status === "Active");
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
      if (request.status !== "Active") return;

      const createdAt = new Date(request.createdAt).getTime();
      const expiration = createdAt + 10 * 60 * 1000;

      const updateTimer = () => {
        const now = Date.now();
        setTimeLeft(Math.max(0, expiration - now));
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }, [request.createdAt, request.status]);

    const formatCountdown = (ms: number) => {
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const isExpired = timeLeft <= 0;
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
        case "Active":
          return (
            <span className={`${baseClass} bg-blue-100 text-blue-700`}>
              Active
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

    const isCollapsed = request.status !== "Active" && !expanded;

    return (
      <div className="transition-all">
        {isCollapsed ? (
          <div
            className=" p-3 bg-gray-50 flex justify-between items-center cursor-pointer rounded-xl hover:shadow"
            onClick={() => setExpanded(true)}
          >
            <p className="text-sm font-medium text-gray-900 truncate">
              {request.user.firstName} {request.user.lastName}
            </p>
            {getStatusBadge()}
          </div>
        ) : (
          <Form method="post" action="/dashboard" key={request.id}
            className="bg-white p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
            onClick={() =>
              request.status !== "Active" && setExpanded(!expanded)
            }
          >
            <AuthenticityTokenInput />
            <input type="hidden" name="intent" value="requestDelete" />
            <input type="hidden" name="requestId" value={request.id} />

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {request.user.firstName} {request.user.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {request.user.phoneNumber || "No phone"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {["pickup", "dropoff"].map((type) => (
                <div key={type} className="flex items-start gap-2">
                  <div
                    className={`w-2 h-2 rounded-full mt-1 ${type === "pickup" ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 capitalize">{type}</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {request[type]?.name || "Unknown"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-xs text-gray-500 space-y-1">
              {request.driverId && (
                <p>
                  <span className="font-medium text-gray-700">Driver:</span>{" "}
                  {request.driverId}
                </p>
              )}
              {request.pickedUpAt && (
                <p>
                  <span className="font-medium text-gray-700">Picked up:</span>{" "}
                  {new Date(request.pickedUpAt).toLocaleString()}
                </p>
              )}
              {request.droppedOffAt && (
                <p>
                  <span className="font-medium text-gray-700">
                    Dropped off:
                  </span>{" "}
                  {new Date(request.droppedOffAt).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              {getStatusBadge()}

              {request.status === "Active" && (
                <button
                  type="submit"
                  disabled={isExpired}
                  className={`px-3 py-0.5 rounded-full border text-xs transition-colors ${
                    isExpired
                      ? "border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-red-300 bg-red-200 text-red-400 hover:bg-red-400 hover:border-red-400 hover:text-white"
                  }`}
                >
                  {isExpired ? "Expired" : "Cancel Request"}
                </button>
              )}
            </div>
          </Form>
        )}
      </div>
    );
  };
  const [showRequests, setShowRequests] = useState(false);
  return (
    <div className={`absolute transition-all bottom-0 left-0 md:bottom-10 md:left-8 z-51 md:z-40 ${showRequests ? 'max-h-80' : ''} w-96 bg-white md:rounded-2xl shadow-xl border border-gray-100 overflow-hidden`} >
      <div className="p-4 border-2 border-y-gray-200 md:border-b md:border-gray-100 flex items-center justify-between bg-gray-100" onClick={() => setShowRequests(!showRequests)}>
        <h3 className="text-sm font-semibold text-gray-700">Requests</h3>
        {requestInfo.length > 0 && (
          <>
            {requestInfo.some(
              (r: any) => r.status === "Active" || r.status === "Pending"
            ) && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {
                  requestInfo.filter(
                    (r: any) => r.status === "Active" || r.status === "Pending"
                  ).length
                }
              </span>
            )}
          </>
        )}
      </div>
      {showRequests &&
      <div className="max-h-64 overflow-y-auto p-4 space-y-3 w-full">
        {sortedRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <ClockIcon className="w-6 h-6" />
            </div>
            <p className="text-sm">No requests</p>
          </div>
        ) : (
          sortedRequests.map((request: any) => (
            <RequestItem key={request.id} request={request} />
          ))
        )}
      </div>}
    </div>
  );
}
