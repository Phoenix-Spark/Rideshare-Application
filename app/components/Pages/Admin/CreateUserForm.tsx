import { useState } from "react";
import { Form, useActionData } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";

export default function CreateUserForm() {
  const actionData = useActionData<{ error?: string }>();
  const [email, setEmail] = useState("")
  const [showEmailError, setShowEmailError] = useState(false)

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Create New User
        </h3>
        <p className="text-gray-600">
          Add a new user to the system with admin or standard privileges.
        </p>
      </div>

      {actionData?.error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md text-red-700">
          {actionData.error}
        </div>
      )}

      <Form
        method="post"
        action="/dashboard/admin"
        className="space-y-5"
        onSubmit={(e) => {
          if (!email.endsWith("us.af.mil")) {
            e.preventDefault();
            setShowEmailError(true);
          }
        }}
      >
        <AuthenticityTokenInput />
        <input type="hidden" name="intent" value="createUser" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              First Name
            </label>
            <input
              required
              type="text"
              name="firstName"
              placeholder="Jane"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name
            </label>
            <input
              required
              type="text"
              name="lastName"
              placeholder="Smith"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Invite Code
          </label>
          <input
            type="text"
            name="inviteCode"
            placeholder="Optional"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            required
            type="email"
            name="email"
            placeholder="jane.smith@us.af.mil"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value.endsWith("us.af.mil")) {
                setShowEmailError(false);
              }
            }}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
          />
          {showEmailError && <label className="block text-sm font-semibold text-red-500 mb-2">Email must be a .mil address</label>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            required
            type="tel"
            name="phoneNumber"
            placeholder="e.g., (555) 123-4567"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <input
            required
            type="password"
            name="password"
            placeholder="••••••••••••••••"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
          >
            Create User
          </button>
        </div>
      </Form>
    </section>
  );
}
