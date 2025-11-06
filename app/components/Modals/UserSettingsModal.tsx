import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { UserIcon } from "../Icons/UserIcon";
import { LockIcon } from "../Icons/LockIcon";
import { VehicleIcon } from "../Icons/VehicleIcon";
import { ShieldIcon } from "../Icons/ShieldIcon";
import { WarningIcon } from "../Icons/WarningIcon";
import { BaseIcon } from "../Icons/BaseIcon";
import { XMarkIcon } from "../Icons/XMarkIcon";
import UserDeleteForm from "../Pages/User/UserDeleteForm";
import UserSecurityForm from "../Pages/User/UserSecurityForm";
import UserVehicleForm from "../Pages/User/UserVehicleForm";
import UserBaseForm from "../Pages/User/UserBaseForm";
import UserPermissionForm from "../Pages/User/UserPermissionForm";
import UserProfileForm from "../Pages/User/UserProfileForm";

export default function UserSettingsModal({ user, base, vehicles }: any) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [selectedTab, setSelectedTab] = useState(tabParam || "Profile");

  const tabs = [
    { name: "Profile", icon: <UserIcon className="size-6" /> },
    { name: "Permissions", icon: <LockIcon className="size-6" /> },
    { name: "Base", icon: <BaseIcon className="size-6" /> },
    { name: "Vehicles", icon: <VehicleIcon className="size-6" /> },
    { name: "Security", icon: <ShieldIcon className="size-6" /> },
    { name: "Deactivation", icon: <WarningIcon className="size-6" /> },
  ];

  useEffect(() => {
    setSearchParams({ tab: selectedTab }, { replace: true });
  }, [selectedTab, setSearchParams]);

  useEffect(() => {
    if (tabParam && tabParam !== selectedTab) {
      setSelectedTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tabName: string) => {
    setSelectedTab(tabName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 to-black/50 backdrop-blur-lg p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-[1000px] h-[700px] flex overflow-hidden relative border border-gray-200/50">
        <aside className="w-80 bg-gradient-to-b from-indigo-50 via-white to-indigo-50/50 p-8 flex flex-col gap-2 border-r border-indigo-100/50 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Settings
            </h2>
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  type="button"
                  onClick={() => handleTabChange(tab.name)}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl font-medium transition-all duration-300 flex items-center gap-3 group ${
                    selectedTab === tab.name
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-105"
                      : "text-gray-700 hover:bg-white/70 hover:shadow-md hover:scale-102"
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 p-10 overflow-y-auto max-h-[85vh] relative bg-gradient-to-br from-white via-indigo-50/10 to-white">
          <Link
            to="/dashboard"
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 hover:bg-red-500 transition-all duration-300 hover:rotate-90"
          >
            <XMarkIcon className="size-6" />
          </Link>

          {selectedTab === "Profile" && <UserProfileForm user={user} />}
          {selectedTab === "Permissions" && <UserPermissionForm user={user} />}
          {selectedTab === "Base" && <UserBaseForm user={user} base={base} />}
          {selectedTab === "Vehicles" && <UserVehicleForm user={user} vehicles={vehicles} />}
          {selectedTab === "Security" && <UserSecurityForm user={user} />}
          {selectedTab === "Deactivation" && <UserDeleteForm user={user} />}
        </div>
      </div>
    </div>
  );
}