export default function CreateBaseForm() {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Create Military Base
        </h3>
        <p className="text-gray-600">
          Add a new military base by filling out the details below.
        </p>
      </div>

      <form className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Base Name
          </label>
          <input
            type="text"
            name="baseName"
            placeholder="e.g., Langley Air Force Base"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Abbreviation
          </label>
          <input
            type="text"
            name="abbreviation"
            placeholder="e.g., LAFB"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Longitude
            </label>
            <input
              type="number"
              name="longitude"
              step="any"
              placeholder="e.g., -76.3604"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Latitude
            </label>
            <input
              type="number"
              name="latitude"
              step="any"
              placeholder="e.g., 37.0824"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
          >
            Add Base
          </button>
        </div>
      </form>
    </section>
  );
}
