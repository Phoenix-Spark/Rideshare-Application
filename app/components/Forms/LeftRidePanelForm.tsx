import { useEffect, useState } from "react";
import { Form, Link, useNavigate, useSearchParams } from "react-router";
import { BaseBoundIcon } from "../Icons/BaseBoundIcon";
import LeftPanelPassengerRequestsForm from "./LeftPanelPassengerRequestsForm";
import LeftPanelPassengerForm from "./LeftPanelPassengerForm";
import LeftPanelDriverForm from "./LeftPanelDriverForm";
import LeftPanelDriverRequestForm from "./LeftPanelDriverRequestForm";
import { LogoutIcon } from "../Icons/LogoutIcon";
import LeftPanelScheduleForm from "./LeftPanelScheduleForm";
import UserSettingsModal, { createTabs } from "../Modals/UserSettingsModal";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";

export default function LeftSideRidePanelForm({
  user,
  station,
  accepted,
  activeRequests,
  requestInfo,
}: any) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const mode = searchParams.get("mode") || "passenger";
  const [isDriverMode, setIsDriverMode] = useState(
    mode === "driver" ? true : false
  );
  const navigate = useNavigate();
  const showMain = !searchParams.get("showmap");
  const toggleMode = () => {
    setIsDriverMode(!isDriverMode);
    setSearchParams({ mode: isDriverMode ? "passenger" : "driver" });
  };
  const tabs = createTabs(user, true)
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
        <div className={`fixed md:absolute bottom-0 md:top-8 left-0 md:left-8 right-0 md:right-auto w-full md:w-96 ${isSheetExpanded ? 'h-[92vh]' : 'h-[60vh]'} md:h-fit md:rounded-2xl z-50 bg-white shadow-2xl md:border border-gray-100 overflow-y-auto transition-[height] duration-500 ease-out`}>
          {/* Mobile drag handle */}
          {!isSheetExpanded && <div
            className={`md:hidden flex justify-center py-2 rounded-t-4xl bg-gradient-to-br from-blue-600 to-indigo-700 cursor-pointer active:bg-indigo-800 transition-transform duration-500 ease-out translate-y-0`}
            onClick={() => setIsSheetExpanded(true)}
          >
            <div className="w-12 h-1.5 bg-white/30 rounded-full" />
          </div>}

          <div
            className="sticky top-0 z-10 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white flex items-center justify-between gap-3 md:cursor-default cursor-pointer active:bg-indigo-800"
            onClick={() => setIsSheetExpanded(false)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="p-3.5 md:p-2.5 bg-white/20 backdrop-blur-sm rounded-xl md:cursor-default cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMobileMenu(!showMobileMenu);
                  }}
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
                          {user?.isDriver
                            ? "Driver Account"
                            : "Passenger Account"}
                        </p>
                      </div>
                      <Form method="post" action="/logout">
                        <AuthenticityTokenInput />
                        {tabs.map((t) => (
                          <Link
                            key={t.name}
                            to={t.to as string}
                            className="relative w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors font-medium text-gray-600 border-b border-gray-200"
                          >

                            <span className="text-xl">{t.icon}</span>
                            <span>{t.label}</span>

                            {t.badge && (
                              <>
                                <span className="absolute right-3 top-1/2 w-2.5 h-2.5 bg-red-500 rounded-full -translate-y-1/2" />
                                <span className="absolute right-3 top-1/2 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping -translate-y-1/2" />
                              </>
                            )}
                          </Link>
                        ))}
                        <button
                          type="submit"
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors font-medium text-red-600"
                        >
                          <LogoutIcon className="size-6" />
                          Logout
                        </button>
                      </Form>
                    </div>
                  </>
                )}
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Base Bound
                </h1>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMode();
                  }}
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

          <div className={`p-6 bg-white ${isSheetExpanded ? 'flex flex-col min-h-[calc(100vh-5rem)]' : ''}`}>
            {!isDriverMode ? (
              <>
                <LeftPanelPassengerForm
                  user={user}
                  station={station}
                  params={searchParams}
                />
              </>
            ) : (
              user?.isDriver && (
                <LeftPanelDriverForm
                  user={user}
                  activeRequests={activeRequests}
                />
              )
            )}

            {/* Spacer when expanded to push request panel to bottom */}
            {isSheetExpanded && <div className="flex-grow md:hidden" />}

            {/* Mobile: Render request panels inside bottom sheet */}
            <div className={`md:hidden ${isSheetExpanded ? 'pt-6 pb-20' : 'mt-6'}`}>
              {!isDriverMode ? (
                <LeftPanelPassengerRequestsForm requestInfo={requestInfo} />
              ) : (
                user?.isDriver && (
                  <LeftPanelDriverRequestForm accepted={accepted} />
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Render request panels as floating panels */}
      {!isDriverMode ? (
        <div className="hidden md:block absolute bottom-0">
          <LeftPanelPassengerRequestsForm requestInfo={requestInfo} />
        </div>
      ) : (
        user?.isDriver && (
          <div className="hidden md:block absolute bottom-0 w-screen">
            <LeftPanelDriverRequestForm accepted={accepted} />
          </div>
        )
      )}
    </>
  );
}
