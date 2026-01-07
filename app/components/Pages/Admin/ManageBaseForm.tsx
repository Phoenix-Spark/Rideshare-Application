import { useState, useRef, useEffect } from "react";
import { Form } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import { AdminIcon } from "~/components/Icons/AdminIcon";
import { EllipsisIcon } from "~/components/Icons/EllipsisIcon";

const VALID_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export default function ManageBaseForm({ base }: any) {
  const [editingId, setEditingId] = useState(null);
  const [deletingBase, setDeletingBase] = useState(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const handleDeleteClick = (b: any) => {
    setDeletingBase(b);
    setDeleteConfirmName("");
    setDeleteConfirmed(false);
    setOpenMenuId(null);
  };

  const canDelete = deleteConfirmed && deleteConfirmName === deletingBase?.name;

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Manage Existing Bases
        </h3>
        <p className="text-gray-600">
          View, update, or remove bases from the system.
        </p>
      </div>

      {base && base.length > 0 ? (
        <div className="space-y-3 max-h-[370px] h-[370px] overflow-y-auto pr-2">
          {base.map((b: any) => (
            <div
              key={b.id}
              className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all bg-white"
            >
              {editingId === b.id ? (
                <div className="p-5">
                  <Form method="post" action="/dashboard/admin?page=bases" className="space-y-4"
                  >
                    <AuthenticityTokenInput />
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="intent" value="updateBase" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Base Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          defaultValue={b.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          State
                        </label>
                        <select
                          name="state"
                          defaultValue={b.state}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="">Select a state</option>
                          {VALID_STATES.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Latitude
                        </label>
                        <input
                          type="text"
                          name="latitude"
                          defaultValue={b.lat}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-black focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Longitude
                        </label>
                        <input
                          type="text"
                          name="longitude"
                          defaultValue={b.long}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-black focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-black text-sm font-medium hover:bg-gray-200 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  </Form>
                </div>
              ) : (
                <div className="relative">
                  <div className="flex items-start justify-between p-5">
                    <div
                      className={`flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 transition-opacity duration-300 ${
                        openMenuId === b.id ? "opacity-30" : "opacity-100"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Base Name
                        </p>
                        <p className="text-base font-semibold text-black">
                          {b.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          State
                        </p>
                        <p className="text-base text-black">{b.state}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Coordinates
                        </p>
                        <p className="text-sm text-black font-mono">
                          {b.lat}, {b.long}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId(openMenuId === b.id ? null : b.id)
                      }
                      className="p-2 hover:bg-gray-100 rounded-lg transition ml-4"
                    >
                      <EllipsisIcon className="size-6 text-black" />
                    </button>
                  </div>

                  <div
                    ref={openMenuId === b.id ? menuRef : null}
                    className={`absolute right-0 top-0 bottom-0 flex items-center gap-2 pr-5 transition-all duration-300 ease-out ${
                      openMenuId === b.id
                        ? "translate-x-0 opacity-100"
                        : "translate-x-full opacity-0 pointer-events-none"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(b.id);
                        setOpenMenuId(null);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(b)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center bg-gray-50/50">
          <div className="text-gray-400 flex justify-center mb-3">
            <AdminIcon className="w-20 h-20" />
          </div>
          <p className="text-gray-500 font-medium text-lg">
            No bases added yet
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Create your first base above to get started
          </p>
        </div>
      )}

      {deletingBase && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">

      <div className="px-6 pt-8 pb-6 text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Base</h3>
        <p className="text-gray-600">
          This will permanently delete{" "}
          <span className="font-semibold text-gray-900">{deletingBase.name}</span>
        </p>
      </div>

      <div className="px-6 pb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type the base name to confirm
          </label>
          <input
            type="text"
            value={deleteConfirmName}
            onChange={(e) => setDeleteConfirmName(e.target.value)}
            placeholder={deletingBase.name}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            autoFocus
          />
        </div>

        <div className="flex items-center gap-3 mt-2">
          <button
            type="button"
            onClick={() => setDeleteConfirmed(!deleteConfirmed)}
            className={`relative inline-flex h-6 w-10 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 ${
              deleteConfirmed ? "bg-red-600" : "bg-gray-300"
            }`}
            role="switch"
            aria-checked={deleteConfirmed}
          >
            <span
              className={`inline-block h-4 w-4  transform rounded-full bg-white shadow transition-transform duration-200 ${
                deleteConfirmed ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-gray-700">
            I understand this action cannot be undone and all data will be permanently deleted
          </span>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => setDeletingBase(null)}
          className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>

        <Form method="post" action="/dashboard/admin?page=bases" className="inline">
          <AuthenticityTokenInput />
          <input type="hidden" name="intent" value="deleteBase" />
          <input type="hidden" name="id" value={deletingBase.id} />
          <button
            type="submit"
            disabled={!canDelete}
            className={`px-5 py-2.5 rounded-xl text-white text-sm font-medium transition ${
              canDelete
                ? "bg-red-600 hover:bg-red-700 shadow-sm"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Delete Permanently
          </button>
        </Form>
      </div>
    </div>
  </div>
)}

    </section>
  );
}
