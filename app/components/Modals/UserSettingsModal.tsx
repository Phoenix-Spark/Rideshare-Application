import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { UserIcon } from "../Icons/UserIcon";
import { LockIcon } from "../Icons/LockIcon";
import { VehicleIcon } from "../Icons/VehicleIcon";
import { ShieldIcon } from "../Icons/ShieldIcon";
import { BaseIcon } from "../Icons/BaseIcon";
import { XMarkIcon } from "../Icons/XMarkIcon";
import UserSecurityForm from "../Pages/User/UserSecurityForm";
import UserVehicleForm from "../Pages/User/UserVehicleForm";
import UserBaseForm from "../Pages/User/UserBaseForm";
import UserPermissionForm from "../Pages/User/UserPermissionForm";
import UserProfileForm from "../Pages/User/UserProfileForm";
import UserInviteForm from "../Pages/User/UserInviteForm";
import { KeyIcon } from "../Icons/KeyIcon";
import { MetricsIcon } from "../Icons/MetricsIcon";
import UserMetricsForm from "../Pages/User/UserMetricsForm";

export const createTabs = ({user, userBase, vehicles}: any) => [
  {
    label: "Profile",
    name: "profile",
    to: 'settings',
    icon: <UserIcon className="size-6" />,
  },
  {
    label: "Permissions",
    name: "permissions",
    to: 'settings',
    icon: <LockIcon className="size-6" />,
  },
  { 
    label: "Base", 
    name: "base", 
    to: 'settings',
    icon: <BaseIcon className="size-6" />,
    badge: !userBase?.base
  },
  {
    label: "Vehicles",
    name: "vehicles",
    to: 'settings',
    icon: <VehicleIcon className="size-6" />,
    badge: user?.isDriver && vehicles.length === 0,
  },
  {
    label: "Metrics",
    name: "metrics",
    to: 'settings',
    icon: <MetricsIcon className="size-6" />,
  },
  {
    label: "Security",
    name: "security",
    to: 'settings',
    icon: <ShieldIcon className="size-6" />,
    badge: user?.isReset,
  },
  {
    label: "Invites",
    name: "invites",
    to: 'settings',
    icon: <KeyIcon className="size-6" />,
    hide: user?.isInvite,
  },
  
  // {
  //   label: "Deactivation",
  //   name: "deactivation",
  //   to: 'settings?tab=deactivation',
  //   icon: <WarningIcon className="size-6" />,
  // },
].filter((tab) => !tab.hide);



export default function UserSettingsModal({
  user,
  base,
  userBase,
  vehicles,
  invite,
  rides
}: any) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState(searchParams.get("tab") ?? "profile");

  const tabs = createTabs({user, userBase, vehicles})
  
  return (
    <div className="fixed inset-0 z-50 flex md:items-center md:justify-center bg-black/50 to-black/50 backdrop-blur-lg md:p-4 w-screen">
      <div className="fixed inset-0 md:relative md:w-[1100px] md:h-[700px] bg-white/95 backdrop-blur-xl md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border-0 md:border border-gray-200/50">
        <aside className="hidden md:block w-80 bg-gradient-to-b from-indigo-50 via-white to-indigo-50/50 p-8 flex-col gap-2 border-r border-indigo-100/50 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Settings
            </h2>
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  type="button"
                  onClick={() => setSelectedTab(tab.name)}
                  className={`relative w-full text-left px-5 py-3.5 rounded-2xl font-medium transition-all duration-300 flex items-center gap-3 group ${
                    selectedTab === tab.name
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-105"
                      : "text-gray-700 hover:bg-white/70 hover:shadow-md hover:scale-102"
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>

                  {tab.badge && (
                    <>
                      <span className="absolute right-3 top-1/2 w-2.5 h-2.5 bg-red-500 rounded-full -translate-y-1/2" />
                      <span className="absolute right-3 top-1/2 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping -translate-y-1/2" />
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 p-10 overflow-y-auto max-h-[95vh] md:max-h-[85vh] relative bg-gradient-to-br from-white via-indigo-50/10 to-white">
          <Link
            to="/dashboard"
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 hover:bg-red-500 transition-all duration-300 hover:rotate-90"
          >
            <XMarkIcon className="size-6" />
          </Link>

          {selectedTab === "profile" && <UserProfileForm user={user} />}
          {selectedTab === "permissions" && <UserPermissionForm user={user} />}
          {selectedTab === "base" && <UserBaseForm user={user} base={base} userBase={userBase}/>}
          {selectedTab === "vehicles" && ( <UserVehicleForm user={user} vehicles={vehicles} /> )}
          {selectedTab === "security" && <UserSecurityForm user={user} />}
          {!user?.isInvite && selectedTab === "invites" && ( <UserInviteForm user={user} invite={invite} /> )}
          {selectedTab === "metrics" && <UserMetricsForm rides={rides} />}
          {/* {selectedTab === "deactivation" && <UserDeleteForm user={user} />} */}
          
        </div>

        {/* Mobile Bottom Tab Bar */}
        {/* <nav className="md:hidden flex overflow-x-auto bg-white border-t border-gray-200 px-2 py-1 safe-area-inset-bottom">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              type="button"
              onClick={() => setSelectedTab(tab.name)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 min-w-[72px] relative ${
                selectedTab === tab.name ? 'text-indigo-600' : 'text-gray-600'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs font-medium truncate max-w-[60px]">{tab.label}</span>
              {tab.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          ))}
        </nav> */}
      </div>
    </div>
  );
}
