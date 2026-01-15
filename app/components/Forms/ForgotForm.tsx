import { Form, Link } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import { useState } from "react";
import Captcha from "../Input/Captcha";

export default function ForgotForm() {
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 relative overflow-hidden">
      <div className="relative bg-white md:rounded-3xl shadow-xl border border-gray-100 p-10 w-screen md:w-[550px]">

        {!submitted ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Forgot Password?
            </h1>
            <p className="text-gray-600 mb-8 text-center">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <Form method="post" action="/forgot" className="space-y-6" onSubmit={() => setSubmitted(true)} >
              <AuthenticityTokenInput />

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <Captcha turnstileToken={turnstileToken} setTurnstileToken={setTurnstileToken} error={error} setError={setError} />
              <button
              type="submit"
              disabled={turnstileToken ? false: true}
              className={`w-full py-4 ${turnstileToken ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30': 'bg-gray-400 rounded-xl hover:cursor-not-allowed text-white'}`}
            >
              Send Reset Link
            </button>
            </Form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-blue-600 hover:text-indigo-600 transition-colors"
              >
                ← Back to Sign In
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Check Your Inbox
            </h1>
            <p className="text-gray-600 text-center">
              If the email you entered is valid, we will send a password reset
              link within the next 10 minutes. Please check your inbox.
            </p>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-blue-600 hover:text-indigo-600 transition-colors"
              >
                ← Back to Sign In
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
