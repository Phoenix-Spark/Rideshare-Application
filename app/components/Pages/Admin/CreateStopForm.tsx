export default function CreateStopForm() {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Create Stop Location
        </h3>
        <p className="text-gray-600">
          Add a new stop location by entering its coordinates and name.
        </p>
      </div>

      <form method="post" action="/admin">
        <input type="hidden" name="intent" value="stop" />
        <div className="space-y-5">
          {/* Base Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Base
            </label>
            <select
              name="baseId"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                -- Choose a base --
              </option>
            </select>
          </div>

          {/* Stop Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stop Name
            </label>
            <input
              type="text"
              name="stopName"
              placeholder="e.g., Gate 2 Pickup Zone"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
            />
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Longitude
              </label>
              <input
                name="longitude"
                placeholder="e.g., -76.3802"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Latitude
              </label>
              <input
                name="latitude"
                placeholder="e.g., 37.0701"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
            >
              Add Stop
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
