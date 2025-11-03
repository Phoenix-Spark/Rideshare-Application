import { Link } from "react-router";

export default function UserSettingsModal({ user }: any) {
  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative transform transition-transform duration-300 scale-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">User Settings</h2>

        <Link
          to="/dashboard"
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close settings modal"
        >
          <p className="text-2xl">✕</p>
        </Link>

        <form method="post" action="/dashboard/settings">
          <div className="flex flex-col gap-5">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder={user.firstName}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder={user.lastName}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                placeholder={user.email}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder={user.phoneNumber}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Link
                to="/dashboard"
                type="button"
                className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
