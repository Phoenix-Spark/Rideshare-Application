import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { BaseBoundIcon } from "../Icons/BaseBoundIcon";
import LeftPanelPassengerRequestsForm from "./LeftPanelPassengerRequestsForm";
import LeftPanelPassengerForm from "./LeftPanelPassengerForm";
import LeftPanelDriverForm from "./LeftPanelDriverForm";
import LeftPanelDriverRequestForm from "./LeftPanelDriverRequestForm";
import { LogoutIcon } from "../Icons/LogoutIcon";

export default function LeftSideRidePanelForm({
  user,
  station,
  accepted,
  activeRequests,
  requestInfo,
}: any) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mode = searchParams.get("mode") || "passenger";
  const [isDriverMode, setIsDriverMode] = useState(mode === 'driver' ? true: false)
  const showMain = 
  !searchParams.get("showmap")
  const toggleMode = () => {
    setIsDriverMode(!isDriverMode)
    setSearchParams({ mode: isDriverMode ? "passenger" : "driver" });
  };

  useEffect(() => {
    if (!searchParams.get("mode")) {
      setSearchParams({ mode: "passenger" });
    }
  }, [searchParams, setSearchParams]);

  return (
    <>
      {!showMain && (
        <div className="absolute top-7 left-6 rounded-xl">
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white flex rounded-xl items-center gap-3">
            <div
              className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl cursor-pointer"
              onClick={() =>
                setSearchParams((prev) => {
                  const params = new URLSearchParams(prev);
                  params.delete("showmap");
                  return params;
                })
              }
            >
              <BaseBoundIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}
      
      {showMain && (
        <div className="absolute top-0 left-0 md:top-8 md:left-8 z-50 w-screen md:w-96 h-screen md:h-fit bg-white md:rounded-2xl shadow-2xl md:border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div 
                  className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl md:cursor-default cursor-pointer"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  <BaseBoundIcon className="w-6 h-6" />
                </div>

                {showMobileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40 md:hidden"
                      onClick={() => setShowMobileMenu(false)}
                    />
                    
                    <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 md:hidden">
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.email}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {user?.isDriver ? "Driver Account" : "Passenger Account"}
                        </p>
                      </div>
                      <Link
                        to="/logout"
                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogoutIcon className="size-6"/>
                        Sign Out
                      </Link>
                    </div>
                  </>
                )}
              </div>
              
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Base Bound</h1>
                <p className="text-blue-100 text-sm">Request Your Ride</p>
              </div>
            </div>

            {user?.isDriver && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-white  sm:inline">
                  {isDriverMode ? "Driver" : "Passenger"}
                </span>
                <button
                  type="button"
                  onClick={toggleMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    isDriverMode ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                      isDriverMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            )}
          </div>

          <div className="p-6 bg-white">
            {!isDriverMode ? (
              <LeftPanelPassengerForm user={user} station={station} params={searchParams} />
            ) : (
              user?.isDriver && (
                <LeftPanelDriverForm user={user} activeRequests={activeRequests} />
              )
            )}
          </div>
        </div>
      )}
      
      {!isDriverMode ? (
        <div className="absolute bottom-0">
          <LeftPanelPassengerRequestsForm requestInfo={requestInfo} />
        </div>
      ) : (
        user?.isDriver && (
          <div className="absolute bottom-0 w-screen">
            <LeftPanelDriverRequestForm accepted={accepted} />
          </div>
        )
      )}
    </>
  );
}