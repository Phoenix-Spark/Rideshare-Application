import { Form, Link } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";

export default function Logout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white md:rounded-3xl shadow-xl border border-gray-100 p-10 w-screen md:w-[550px] text-center">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 "></div>

        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Out?</h1>
        <p className="text-gray-600 mb-6">
          Would you like to sign out or return to the dashboard?
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.03] active:scale-[0.97]"
          >
            Go Back
          </Link>

          <Form method="post" action="/logout">
            <AuthenticityTokenInput />
            <button
              type="submit"
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.03] active:scale-[0.97]"
            >
              Sign out
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
