import { Form } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";

export default function SendCodeForm({ user }: any) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Two-Factor Authentication
          </h2>
          <p className="text-gray-600">
            We'll send a verification code to your email
          </p>
        </div>

        <Form method="post" action="/send">
          <div className="flex flex-col justify-between items-center">
            <AuthenticityTokenInput />
            <input type="hidden" name="intent" value="sendCode" />
            <input type="hidden" name="userId" value={user?.id} />
            <input type="hidden" name="email" value={user?.email} />
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Send code to:</p>
              <p className="text-lg font-semibold text-gray-800">
                {user?.email}
              </p>
            </div>

            <button
              type="submit"
              className=" bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Send Code
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
