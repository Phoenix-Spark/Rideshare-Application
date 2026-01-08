import { Form, useActionData } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import ButtonControls from "~/components/Buttons/ButtonControls";
import { KeyIcon } from "~/components/Icons/KeyIcon";
import { MailIcon } from "~/components/Icons/MailIcon";
import { PhoneIcon } from "~/components/Icons/PhoneIcon";
import { UserIcon } from "~/components/Icons/UserIcon";

export default function UserProfileForm({ user }: any) {
  const actionData = useActionData<{ error?: string; success?: boolean }>();

  return (
    <div className="space-y-4">
      <div className="border-l-4 border-indigo-500 pl-6">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          Profile Information
        </h3>
        <p className="text-gray-500">
          Update your personal details and contact information
        </p>
      </div>

      <Form method="post" action="/dashboard/settings">
        <AuthenticityTokenInput />
        <input type="hidden" name="intent" value="user" />
        <div className="flex flex-col min-h-full space-y-5">
          
          {actionData?.error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-md text-red-700">
              {actionData.error}
            </div>
          )}

          {actionData?.success && (
            <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-md text-green-700">
              Profile updated successfully!
            </div>
          )}

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <UserIcon className="size-6" />
                </span>
                <input
                  type="text"
                  name="firstName"
                  minLength={1}
                  maxLength={256}
                  placeholder={user?.firstName}
                  className="w-full rounded-xl border-2 border-gray-200 pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <UserIcon className="size-6" />
                </span>
                <input
                  type="text"
                  name="lastName"
                  minLength={1}
                  maxLength={256}
                  placeholder={user?.lastName}
                  className="w-full rounded-xl border-2 border-gray-200 pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {user?.isInvite && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Invite Access Code
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <KeyIcon className="size-6" />
                </span>
                <p className="border border-2 border-gray-200 rounded-xl pl-12 py-3 text-gray-400 select-none">{user?.inviteCode}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <MailIcon className="size-6" />
              </span>

              {!user?.isInvite ? (
                <input
                  type="email"
                  name="email"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  maxLength={256}
                  placeholder={user?.email}
                  className="w-full rounded-xl border-2 border-gray-200 pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                />
              ) : (
                <p className="border border-2 border-gray-200 rounded-xl pl-12 py-3 text-gray-400 select-none">{user?.email}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <PhoneIcon className="size-6" />
              </span>
              <input
                type="tel"
                name="phoneNumber"
                pattern="\d{10}"
                maxLength={10}
                placeholder={user?.phoneNumber}
                className="w-full rounded-xl border-2 border-gray-200 pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
              />
            </div>
          </div>

          <div className="absolute bottom-10 right-10">
            <ButtonControls />
          </div>
        </div>
      </Form>
    </div>
  );
}