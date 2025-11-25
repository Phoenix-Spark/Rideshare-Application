import { useState, useRef, useEffect } from "react";
import { SettingsIcon } from "../Icons/SettingsIcon";
import { AdminIcon } from "../Icons/AdminIcon";
import { LogoutIcon } from "../Icons/LogoutIcon";
import { Form, Link } from "react-router";

export default function RightSideUserPanelForm({ user }: any) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="w-[350px] max-w-[400px] bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      <button
        onClick={toggleDropdown}
        className="flex items-center w-full justify-between px-4 py-1.5 hover:bg-gray-50 transition-colors"
        aria-expanded={isDropdownOpen}
        aria-label="Toggle profile menu"
      >
        <div className="flex flex-col text-left max-w-[70%]">
          <p className="text-gray-900 font-semibold text-lg truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-gray-500 text-sm truncate">{user?.email}</p>
        </div>

        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
          {user?.firstName[0]}
          {user?.lastName[0]}
        </div>
      </button>

      {isDropdownOpen && (
        <div className="w-full p-3 space-y-2 bg-white border-t border-gray-100">
          {user?.isAdmin && (
            <Link
              to="/dashboard/admin"
              onClick={() => setIsDropdownOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors font-medium text-gray-800"
            >
              <AdminIcon className="size-6" />
              Admin
            </Link>
          )}

          <Link
            to="/dashboard/settings"
            onClick={() => setIsDropdownOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors font-medium text-gray-800"
          >
            <SettingsIcon className="size-6" />
            Settings
          </Link>

          <Form method="post" action="/logout">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors font-medium text-red-600"
            >
              <LogoutIcon className="size-6" />
              Logout
            </button>
          </Form>
        </div>
      )}
    </div>
  );
}
