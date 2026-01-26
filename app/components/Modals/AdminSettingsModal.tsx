import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import CreateBaseForm from "../Pages/Admin/CreateBaseForm";
import ManageBaseForm from "../Pages/Admin/ManageBaseForm";
import CreateStopForm from "../Pages/Admin/CreateStopForm";
import ManageStopForm from "../Pages/Admin/ManageStopForm";
import ManageUserForm from "../Pages/Admin/ManageUserForm";
import CreateUserForm from "../Pages/Admin/CreateUserForm";
import { AdminIcon } from "../Icons/AdminIcon";
import { MapPinIcon } from "../Icons/MapPinIcon";
import { UserIcon } from "../Icons/UserIcon";
import { SettingsIcon } from "../Icons/SettingsIcon";
import { VehicleIcon } from "../Icons/VehicleIcon";
// import CreateRidesTable from "../Forms/CreateRidesTable";
// import Rides from "~/routes/auth/rides";

export default function AdminSettingsModal({ user, base, station, accounts, actionData }: any) {
  const location = useLocation();
  const navigate = useNavigate();
  const isRidesRoute = location.pathname.includes("/admin/rides");
  const [activeTab, setActiveTab] = useState(isRidesRoute ? "rides" : "bases");

  useEffect(() => {
    if (isRidesRoute) {
      setActiveTab("rides");
    }
  }, [isRidesRoute]);

  const menuTabs = [
    {
      label: "Manage Bases",
      tab: "bases",
      Icon: AdminIcon,
      enabled: true,
    },
    {
      label: "Manage Stops",
      tab: "stops",
      Icon: MapPinIcon,
      enabled: true,
    },
    {
      label: "Manage Users",
      tab: "users",
      Icon: UserIcon,
      enabled: true,
    },
    {
      label: "Ride Records",
      tab: "rides",
      Icon: VehicleIcon,
      enabled: true,
    },
    {
      label: "Metrics",
      tab: "metrics",
      Icon: AdminIcon,
      enabled: false,
    },
  ]


  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "rides") {
      navigate("/dashboard/admin/rides");
    } else if (isRidesRoute) {
      navigate("/dashboard/admin");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "bases":
        return (
          <div className="space-y-8">
            <CreateBaseForm />
            <ManageBaseForm base={base} actionData={actionData} />
          </div>
        );
      case "stops":
        return (
          <div className="space-y-8">
            <CreateStopForm base={base} />
            <ManageStopForm base={base} station={station} actionData={actionData} />
          </div>
        );
      case "users":
        return (
          <div className="space-y-8">
            <CreateUserForm />
            <ManageUserForm accounts={accounts} base={base} user={user} actionData={actionData}/>
          </div>
        );
      case "rides":
        return <Outlet />;
      case "metrics":
        return (
          <div className="space-y-8">
            {/* <CreateRidesTable /> */}
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            <CreateBaseForm />
            <ManageBaseForm base={base} />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl w-full max-w-7xl h-[65vh] flex overflow-hidden">
        <div className="w-90 bg-white border-r border-gray-200 flex flex-col shadow-lg">
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
              <Link
                to="/dashboard"
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
            </div>
            <p className="text-sm text-gray-500">Manage your system settings</p>
          </div>

          <nav className="flex-1 flex flex-col p-4 gap-2">
            {menuTabs.filter(tab => tab.enabled).map(item => 
              <button
                onClick={() => handleTabChange(item.tab)}
                className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-xl font-semibold transition-all ${
                activeTab === item.tab
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
                <item.Icon className="size-6" />
                <span>{item.label}</span>
              </button>
            )}
            {/* <button
              onClick={() => handleTabChange("bases")}
              className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-xl font-semibold transition-all ${
                activeTab === "bases"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <AdminIcon className="size-6" />
              <span>Manage Bases</span>
            </button>

            <button
              onClick={() => handleTabChange("stops")}
              className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-xl font-semibold transition-all ${
                activeTab === "stops"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <MapPinIcon className="size-6" />
              <span>Manage Stops</span>
            </button>

            <button
              onClick={() => handleTabChange("users")}
              className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-xl font-semibold transition-all ${
                activeTab === "users"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <UserIcon className="size-6" />
              <span>Manage Users</span>
            </button> */}
          </nav>

          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Administrator</p>
                <p className="text-xs text-gray-500">{user?.isAdmin && user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
