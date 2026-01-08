import { Form } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import ButtonControls from "~/components/Buttons/ButtonControls";

export default function UserBaseForm({ user, base, userBase }: any) {
  const bases = base.base;

  return (
    <div className="flex flex-col min-h-full space-y-6">
      <div className="border-l-4 border-indigo-500 pl-6">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Assigned Base</h3>
        <p className="text-gray-500">
          Select your primary operating base location
        </p>
      </div>

      {!userBase.base && (
          <div className="bg-red-100 p-2 rounded-lg border border-1 border-red-400">
          <p className="text-black">Please select a duty location to start requesting rides from your base.</p>
        </div>
        )}

      <Form method="post" action="/dashboard/settings"
        className="flex flex-col flex-1"
      >
        <AuthenticityTokenInput />
        <input type="hidden" name="intent" value="user" />
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Base Location
          </label>
          <select
            name="baseId"
            className="w-full rounded-xl border-2 border-gray-200 px-5 py-3 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white cursor-pointer hover:border-indigo-300"
          >
            <option value="">-- Select Base --</option>
            {bases.map((b: any) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.state})
              </option>
            ))}
          </select>
        </div>

        {user?.base?.id && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
            <span className="block text-sm text-gray-500 font-semibold mb-1">
              Current Assigned Base
            </span>
            <span className="block text-gray-800 font-medium text-lg">
              {user.base.name} ({user.base.state})
            </span>
          </div>
        )}

        <div className="absolute bottom-0 md:bottom-10 right-10">
          <ButtonControls />
        </div>
      </Form>
    </div>
  );
}
