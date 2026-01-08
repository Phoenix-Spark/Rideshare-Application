import { Form } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";

export default function VerifyCodeForm({ user, actionData, csrfToken}: any) {
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Email Verification
          </h2>
          <p className="text-gray-600">
            Enter the code sent to
            <br />
            <span className="font-semibold text-gray-800">{user?.email}</span>
          </p>
        </div>

        {actionData?.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {actionData.error}
          </div>
        )}

        <Form method="post" action="/verify">
          <AuthenticityTokenInput />
          <input type="hidden" name="intent" value="tryCode" />
          <input type="hidden" name="userId" value={user.id} />
          

          <div className="mb-6">
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Verification Code
            </label>
            <input
              type="text"
              name="code"
              required
              maxLength={8}
              placeholder="Enter 8-digit code"
              className="w-full px-4 py-3 text-center text-black text-lg font-semibold tracking-widest uppercase border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Verify Code
          </button>
        </Form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Didn't receive a code?{" "}
          <Form method="post" action="/verify" className="inline">
            <AuthenticityTokenInput />
            <input type="hidden" name="intent" value="sendCode" />
            <input type="hidden" name="email" value={user?.email} />
            <input type="hidden" name="userId" value={user?.id} />
            <button
              type="submit"
              className="text-blue-600 font-semibold hover:underline"
            >
              Resend
            </button>
          </Form>
        </p>

        <p className="text-center text-sm text-gray-500 mt-6"></p>
      </div>
    </div>
  );
}
