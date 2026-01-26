import { useState } from "react";
import { Form } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import ButtonControls from "~/components/Buttons/ButtonControls";
import { LockIcon } from "~/components/Icons/LockIcon";
import { MailIcon } from "~/components/Icons/MailIcon";

export default function UserSecurityForm({ user }: any) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordsMatch = password === confirmPassword && password.length > 0;

  return (
    <Form method="post" action="/dashboard/settings">
      <AuthenticityTokenInput />
      <input type="hidden" name="intent" value="user" />
      <div className="flex flex-col min-h-full space-y-6">
        <div className="border-l-4 border-indigo-500 pl-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            Security Settings
          </h3>
          <p className="text-gray-500">
            Manage password and two-factor authentication
          </p>
        </div>

        {user?.isReset && (
          <div className="bg-red-100 p-2 rounded-lg border border-1 border-red-400">
          <p className="text-black">Your password has been reset please create a new one.</p>
        </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Change Password
            </label>
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <LockIcon className="size-6" />
              </span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-xl border-2 border-gray-200 pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
              />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400">
                <LockIcon className="size-6" />
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={`w-full rounded-xl border-2 pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-300 ${
                  confirmPassword.length > 0
                    ? passwordsMatch
                      ? "border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                      : "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                }`}
              />
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-red-500 text-sm mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200 space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Two-Factor Authentication
            </label>

            <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-4">
              <span className="text-2xl">
                <MailIcon className="size-6 text-black/40" />
              </span>
              <div>
                <p className="text-sm text-gray-600">Enrolled Email</p>
                <p className="font-semibold text-gray-900">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 right-10">
          <ButtonControls disabled={!passwordsMatch} />
        </div>
      </div>
    </Form>
  );
}


