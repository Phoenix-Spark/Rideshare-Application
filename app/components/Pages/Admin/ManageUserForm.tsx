import { useState } from "react";
import { Form } from "react-router";
import ToggleSwitch from "~/components/Buttons/ToggleSwitch";
import { WarningIcon } from "~/components/Icons/WarningIcon";

export default function ManageUserForm({ accounts , base}: any) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDriver, setIsDriver] = useState(false);
  const [isPassenger, setIsPassenger] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [selectedBase, setSelectedBase] = useState("");
  const [deletingUser, setDeletingUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setSelectedUserId(userId);

    const user = accounts.find((u: any) => u.id === userId);

    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
      setIsAdmin(!!user.isAdmin);
      setIsDriver(!!user.isDriver);
      setIsPassenger(!!user.isPassenger);
      setIsReset(!!user.isReset);
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setIsAdmin(false);
      setIsDriver(false);
      setIsPassenger(false);
      setIsReset(false);
    }
  };

  return (
    <>
      <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div className="mb-6">
        <div className="inline-flex w-full items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Manage Users
          </h3>
          <select className="rounded-lg p-2 -mt-3 mr-2 border border-gray-200 text-black w-[300px]" onChange={(e) => setSelectedBase(e.currentTarget.value)}>
           {base.map(b => <option value={b.id}>{b.name}</option>)}
          </select>
        </div>
          <p className="text-gray-600">
            Select an existing user to view or modify their details.
          </p>
        </div>

        {selectedUserId &&
          (() => {
            const user = accounts.find((u: any) => u.id === selectedUserId);
            if (user?.resetCode) {
              return (
                <div className="mt-2 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <span className="font-semibold">Reset Code:</span>{" "}
                    {user.resetCode}
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Provide this code to the user so they can log in with the
                    new password.
                  </p>
                </div>
              );
            }
          })()}

        <div className="mt-5">
          <Form
            method="post"
            action="/dashboard/admin?page=users"
            className="space-y-5"
          >
            <input type="hidden" name="intent" value="updateUser" />
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select User
              </label>
              <select
                name="userId"
                value={selectedUserId}
                onChange={handleUserChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              >
                <option value="">-- Choose a user --</option>
                {accounts.filter(a => a.baseId === selectedBase).map((user: any) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
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
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., (555) 123-4567"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-2">
              {selectedUserId &&
                (() => {
                  const selectedUser = accounts.find(
                    (u: any) => u.id === selectedUserId
                  );
                  if (selectedUser && !selectedUser.isInvite) {
                    return (
                      <ToggleSwitch
                        label="Administrator"
                        name="isAdmin"
                        checked={isAdmin}
                        onChange={setIsAdmin}
                      />
                    );
                  }
                  return null;
                })()}
              <ToggleSwitch
                label="Driver"
                name="isDriver"
                checked={isDriver}
                onChange={setIsDriver}
              />
              <ToggleSwitch
                label="Passenger"
                name="isPassenger"
                checked={isPassenger}
                onChange={setIsPassenger}
              />
              <ToggleSwitch
                label="Reset Password"
                name="isReset"
                checked={isReset}
                onChange={setIsReset}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const selectedUser = accounts.find(
                    (u: any) => u.id === selectedUserId
                  );
                  if (selectedUser) {
                    setDeletingUser({
                      id: selectedUser.id,
                      name: `${selectedUser.firstName} ${selectedUser.lastName}`,
                    });
                  }
                }}
                disabled={!selectedUserId}
                className={`px-8 py-3 rounded-lg font-semibold border transition-all ${
                  selectedUserId
                    ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                    : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                }`}
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
          </Form>
        </div>
      </section>

      {deletingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-6 pt-8 pb-6 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <WarningIcon className="size-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Delete User
              </h3>
              <p className="text-gray-600">
                This will permanently delete{" "}
                <span className="font-semibold text-gray-900">
                  {deletingUser.name}
                </span>
                .
              </p>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <Form method="post" action="/dashboard/admin?page=users">
                <input type="hidden" name="intent" value="deleteUser" />
                <input type="hidden" name="userId" value={deletingUser.id} />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-500 rounded-xl text-white text-sm font-medium transition"
                >
                  Delete Permanently
                </button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
