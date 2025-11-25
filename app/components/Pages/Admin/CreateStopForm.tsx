import { useState } from "react";
import { Form } from "react-router";

export default function CreateStopForm({ base }: any) {
  const [baseId, setBaseId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  const hasBases = Array.isArray(base) && base.length > 0;

  const isFormValid =
    hasBases &&
    baseId &&
    name.trim() !== "" &&
    description.trim() !== "" &&
    longitude.trim() !== "" &&
    latitude.trim() !== "";

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

      <Form method="post" action="/dashboard/admin?page=stops">
        <input type="hidden" name="intent" value="createStop" />
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Base
            </label>
            {!hasBases ? (
              <div className="flex items-center gap-2 bg-red-100 border-l-4 border-red-500 text-red-800 rounded-md px-4 py-2">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-sm font-medium">
                  You must create a base before adding stops.
                </span>
              </div>
            ) : (
              <select
                name="baseId"
                value={baseId}
                onChange={(e) => setBaseId(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              >
                <option value="">-- Choose a base --</option>
                {base.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stop Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Gate 2 Pickup Zone"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stop Description
            </label>
            <input
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Front gate entrance"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Latitude
              </label>
              <input
                name="latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
                placeholder="e.g., 37.0701"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Longitude
              </label>
              <input
                name="longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
                placeholder="e.g., -76.3802"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-8 py-3 rounded-lg text-white font-semibold shadow-lg transition-all ${
                isFormValid
                  ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
                  : "bg-gray-300 cursor-not-allowed shadow-none"
              }`}
            >
              Add Stop
            </button>
          </div>
        </div>
      </Form>
    </section>
  );
}
