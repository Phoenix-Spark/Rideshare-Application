import { Form, Link, useActionData } from "react-router";
import { WarningIcon } from "../Icons/WarningIcon";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";

export default function MiddlePanelForm({ user, vehicles, bases }: any) {
  const hasBase = !!user?.base?.id;
  const isReset = !!user?.isReset;
  const isDriver = !!user?.isDriver;
  const isVehicle = vehicles;

  const hasVehicleError = isDriver && isVehicle.length === 0;
  const noErrors = hasBase && !isReset;

  if (noErrors) return null;

  return (
    <div className=" fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-3 w-full max-w-md">
      {!hasBase && (
        <>
          <div className="blur-md md:block absolute -top-8 w-screen h-screen bg-black/30 z-40 animate-in fade-in duration-200" />

          <dialog
            className="fixed mt-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
                       w-full max-w-md bg-white rounded-2xl shadow-2xl p-0 border-0
                       animate-in zoom-in-95 fade-in duration-200"
            open
          >
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <WarningIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Complete Your Profile
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Select your duty location to continue
                  </p>
                </div>
              </div>

              <Form method="POST" action="/dashboard" className="space-y-6">
                <AuthenticityTokenInput />

                <div className="space-y-2">
                  <input type="hidden" name="intent" value="initialSetup" />
                  <input type="hidden" name="userId" value={user?.id} />
                  <label
                    htmlFor="baseId"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Duty Location
                  </label>
                  <select
                    id="baseId"
                    name="baseId"
                    required
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900
                               focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100
                               transition-all duration-300 bg-white"
                  >
                    {bases.map((base: { id: string; name: string }) => (
                      <option value={base.id}>{base.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl
                             hover:bg-indigo-700 active:bg-indigo-800
                             focus:ring-4 focus:ring-indigo-100
                             transition-all duration-300 shadow-lg hover:shadow-xl
                             transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Continue
                </button>
              </Form>

              <p className="text-xs text-gray-500 text-center mt-4">
                You can change this later in your settings
              </p>
            </div>
          </dialog>
        </>
      )}

      {hasVehicleError && (
        <Link
          to="/dashboard/settings"
          className="flex w-full max-w-[500px] items-center gap-3 bg-white text-red-700 px-4 py-3 rounded-lg border border-red-200 shadow-lg animate-in fade-in duration-200
             hover:bg-red-100 hover:cursor-pointer transition-colors"
        >
          <WarningIcon className="w-5 h-5 text-red-500" />
          <span className="font-medium">
            Driver mode is enabled, add a vehicle to your account.
          </span>
        </Link>
      )}

      {isReset && (
        <Link
          to="/dashboard/settings"
          className="flex w-full max-w-[500px] items-center gap-3 bg-white text-red-700 px-4 py-3 rounded-lg border border-red-200 shadow-lg animate-in fade-in duration-200
             hover:bg-red-100 hover:cursor-pointer transition-colors"
        >
          <WarningIcon className="w-5 h-5 text-red-500" />
          <span className="font-medium">
            Please create a new password to continue.
          </span>
        </Link>
      )}
    </div>
  );
}
