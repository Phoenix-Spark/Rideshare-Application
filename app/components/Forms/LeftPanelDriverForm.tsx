import { Form, useNavigation } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import { displayName } from "../Utilities/formatName";

export default function LeftPanelDriverForm({ user, activeRequests }: any) {
  const navigation = useNavigation();
  
  const isSubmitting = navigation.state === "submitting";
  const submittingRequestId = navigation.formData?.get("requestId");

  return (
    <div className="max-h-[500px] overflow-y-auto">
      {activeRequests.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">No active requests</p>
      ) : (
        activeRequests.map((request: any) => {
          const isThisRequestSubmitting = isSubmitting && submittingRequestId === request.id;
          
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

          return (
            <Form method="post" action="/dashboard?mode=driver" key={request.id}>
              <AuthenticityTokenInput />
              <input type="hidden" name="intent" value="acceptRequest" />
              <input type="hidden" name="requestId" value={request.id} />
              <input type="hidden" name="driverId" value={user.id} />
              <input type="hidden" name="userId" value={request.user.id}/>
              <div className="bg-gray-50 rounded-xl p-4 mb-4 shadow-md hover:shadow-md transition">
                <div className="grid grid-cols-2 gap-4 items-start">
                  <div>
                    <p className="font-semibold text-gray-700">
                      {displayName(request.user.firstName, request.user.lastName)}
                    </p>
                    <p className="text text-gray-500">
                      {request.user.phoneNumber}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge()}
                    <button
                      type="submit"
                      disabled={isThisRequestSubmitting}
                      className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isThisRequestSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Accepting...
                        </>
                      ) : (
                        "Accept Request"
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  {request.pickup.name} → {request.dropoff.name}
                </p>
              </div>
            </Form>
          );
        })
      )}
    </div>
  );
}