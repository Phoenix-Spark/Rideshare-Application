import { useState } from "react";
import { Form, useActionData } from "react-router";
import { EyeClosedIcon } from "../Icons/EyeClosedIcon";
import { EyeOpenIcon } from "../Icons/EyeOpenIcon";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [useInvite, setUseInvite] = useState(false);
  const actionData = useActionData<{ error?: string }>();

  const fields = [
    { label: "First Name", name: "firstName", type: "text", placeholder: "John" },
    { label: "Last Name", name: "lastName", type: "text", placeholder: "Doe" },
    { label: "Email Address", name: "email", type: "email", placeholder: "john.doe@us.af.mil" },
    { label: "Phone Number", name: "phoneNumber", type: "tel", placeholder: "(123) 456-7890", maxLength: 14 },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 md:p-6 relative md:py-12">
      <div className="hidden md:block absolute inset-0 opacity-30 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-white md:rounded-3xl md:shadow-xl md:border border-gray-100 w-full min-h-screen md:min-h-0 md:h-auto md:max-w-[550px] md:mx-auto p-6 md:p-10 flex flex-col items-center">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 md:rounded-t-full" />

        <div className="mb-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A9 9 0 1118.88 6.195M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="flex flex-col text-gray-700 text-sm gap-1">
              <span className="text-3xl font-bold text-gray-900">Create Account</span>
              <span className="text-gray-500">Join Base Bound to start your secure rides.</span>
              <span className="text-gray-500">Enter your email and invite code to join.</span>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <Form method="POST" action="/register" className="w-full max-w-md space-y-5">
            <AuthenticityTokenInput />

            {actionData?.error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md text-red-700">
                {actionData.error}
              </div>
            )}

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Sign up with Invite Code</span>
              <button
                type="button"
                onClick={() => setUseInvite(!useInvite)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${
                  useInvite ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    useInvite ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                useInvite ? "max-h-40 opacity-100 mt-0" : "max-h-0 opacity-0 mt-0"
              }`}
            >
              {useInvite && (
                <div className="mt-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="inviteCode">
                    Invite Code
                  </label>
                  <input
                    type="text"
                    id="inviteCode"
                    name="inviteCode"
                    placeholder="Enter invite code"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                  />
                </div>
              )}
            </div>

            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor={field.name}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                />
              </div>
            ))}

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••••••••••"
                  required
                  className="w-full px-4 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeClosedIcon className="size-5" /> : <EyeOpenIcon className="size-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mb-8 md:mb-0 py-4 mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-semibold text-white text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30"
            >
              Create Account
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
