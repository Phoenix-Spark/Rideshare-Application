import { useState } from "react";

export default function ManageUserForm() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDriver, setIsDriver] = useState(false);
  const [isPassenger, setIsPassenger] = useState(false);
  const [deletingUser, setDeletingUser] = useState<{ id: string; name: string } | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const canDelete = deletingUser && deleteConfirmName === deletingUser.name;

  return (
    <>
      <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Manage Users</h3>
          <p className="text-gray-600">
            Select an existing user to view or modify their details.
          </p>
        </div>

        <form method="post" action="/admin">
          <input type="hidden" name="intent" value="edit" />
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select User
              </label>
              <select
                name="userId"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              >
                <option value="">-- Choose a user --</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@domain.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="e.g., (555) 123-4567"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              />
            </div>

            <div className="flex items-center gap-6 mt-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdmin(!isAdmin)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isAdmin ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                  role="switch"
                  aria-checked={isAdmin}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                      isAdmin ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700 font-medium">Administrator</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDriver(!isDriver)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDriver ? "bg-green-600" : "bg-gray-300"
                  }`}
                  role="switch"
                  aria-checked={isDriver}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                      isDriver ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700 font-medium">Driver</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPassenger(!isPassenger)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    isPassenger ? "bg-yellow-500" : "bg-gray-300"
                  }`}
                  role="switch"
                  aria-checked={isPassenger}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                      isPassenger ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700 font-medium">Passenger</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser({ id: "123", name: "John Doe" })}
                className="px-8 py-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold border border-red-200 transition-all"
              >
                Remove User
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </section>

      {deletingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 pt-8 pb-6 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete User</h3>
              <p className="text-gray-600">
                This will permanently delete{" "}
                <span className="font-semibold text-gray-900">{deletingUser.name}</span>
              </p>
            </div>

            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type the user name to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmName}
                  onChange={(e) => setDeleteConfirmName(e.target.value)}
                  placeholder={deletingUser.name}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  autoFocus
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <form method="post" action="/admin" className="inline">
                <input type="hidden" name="intent" value="deleteUser" />
                <input type="hidden" name="id" value={deletingUser.id} />
                <button
                  type="submit"
                  disabled={!canDelete}
                  className={`px-5 py-2.5 rounded-xl text-white text-sm font-medium transition ${
                    canDelete
                      ? "bg-red-600 hover:bg-red-700 shadow-sm"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Delete Permanently
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
