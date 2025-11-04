import { useState } from "react";
import { Link } from "react-router";
import CreateBaseForm from "../Pages/Admin/CreateBaseForm";
import ManageBaseForm from "../Pages/Admin/ManageBaseForm";
import CreateStopForm from "../Pages/Admin/CreateStopForm";
import ManageStopForm from "../Pages/Admin/ManageStopForm";
import ManageUserForm from "../Pages/Admin/ManageUserForm";
import CreateUserForm from "../Pages/Admin/CreateUserForm";
import { AdminIcon } from "../Icons/AdminIcon";
import { MapPinIcon } from "../Icons/MapPinIcon";
import { UserIcon } from "../Icons/UserIcon";

export default function AdminSettingsModal({ user }: any) {
  const [activeTab, setActiveTab] = useState("bases");

  const renderContent = () => {
    switch (activeTab) {
      case "bases":
        return (
          <div className="space-y-8">
            <CreateBaseForm />
            <ManageBaseForm />
          </div>
        );

      case "stops":
        return (
          <div className="space-y-8">
            <CreateStopForm />
            <ManageStopForm />
          </div>
        );

      case "users":
        return (
          <div className="space-y-8">
            <CreateUserForm />
            <ManageUserForm />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl w-full max-w-7xl h-[55vh] flex overflow-hidden">
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg">
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
            <button
              onClick={() => setActiveTab("bases")}
              className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-xl font-semibold transition-all ${
                activeTab === "bases"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">
                <AdminIcon className="size-6"/>
              </span>
              <span>Manage Bases</span>
            </button>

            <button
              onClick={() => setActiveTab("stops")}
              className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-xl font-semibold transition-all ${
                activeTab === "stops"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">
                <MapPinIcon className="size-6" />
              </span>
              <span>Manage Stops</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-xl font-semibold transition-all ${
                activeTab === "users"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">
                <UserIcon className="size-6" />
              </span>
              <span>Manage Users</span>
            </button>
          </nav>

          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Administrator</p>
                <p className="text-xs text-gray-500">{user.isAdmin && user.email}</p>
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