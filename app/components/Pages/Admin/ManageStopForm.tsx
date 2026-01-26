import { useState, useRef, useEffect } from "react";
import { MapPinIcon } from "~/components/Icons/MapPinIcon";
import { EllipsisIcon } from "~/components/Icons/EllipsisIcon";
import { Form, useSearchParams } from "react-router";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";

export default function ManageStopForm({ base, station, actionData }: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingStop, setDeletingStop] = useState<boolean>(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [selectedBase, setSelectedBase] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

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

  useEffect(() => {
    setSearchParams(prev => {
      if (selectedBase) {
        prev.set("selectedBase", btoa(selectedBase));
      } else {
        prev.delete("selectedBase");
      }
      return prev;
    });
  }, [selectedBase, setSearchParams])

  useEffect(() => {
    if(actionData && actionData.success){
      setDeletingStop(false)
    }
  }, [actionData])

  const handleDeleteClick = (s: any) => {
    setDeletingStop(s);
    setDeleteConfirmName("");
    setDeleteConfirmed(false);
    setOpenMenuId(null);
  };

  const canDelete = deleteConfirmed && deleteConfirmName === deletingStop?.name;

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <div className="mb-8">
        <div className="inline-flex w-full items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Manage Stop Locations
          </h3>
          <select className="rounded-lg p-2 -mt-3 mr-2 border border-gray-200 text-black w-[300px]" onChange={(e) => setSelectedBase(e.currentTarget.value)}>
            <option>Select Base</option>
           {base.map((b: {id: string, name: string}) => <option value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <p className="text-gray-600">
          View, update, or remove stop locations from the system.
        </p>
      </div>

      {station && station.length > 0 ? (
        <div className="space-y-3 max-h-[370px] h-[370px] overflow-y-auto pr-2">
          {station.filter(loc => loc.baseId === selectedBase).map((s: any) => (
            <div
              key={s.id}
              className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all bg-white relative"
            >
              {editingId === s.id ? (
                <div className="p-5">
                  <Form method="post" action="/dashboard/admin?page=stops" className="space-y-4">
                    <AuthenticityTokenInput />
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="intent" value="updateStop" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stop Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          defaultValue={s.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Base
                        </label>
                        <select
                          name="baseId"
                          defaultValue={s.baseId || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          {base.map((item: any) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          name="description"
                          defaultValue={s.description}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Latitude
                        </label>
                        <input
                          type="text"
                          name="latitude"
                          defaultValue={s.latitude}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Longitude
                        </label>
                        <input
                          type="text"
                          name="longitude"
                          defaultValue={s.longitude}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm font-medium hover:bg-gray-200 transition"
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
                      className={`flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 transition-opacity duration-300 ${
                        openMenuId === s.id ? "opacity-30" : "opacity-100"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Stop Name
                        </p>
                        <p className="text-base font-semibold text-black">
                          {s.name}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Base Name
                        </p>
                        <p className="text-base text-black">
                          {s.base?.name || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Coordinates
                        </p>
                        <p className="text-sm text-black font-mono">
                          {s.latitude}, {s.longitude}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Description
                        </p>
                        <p className="text-base text-black">
                          {s.description || "-"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId(openMenuId === s.id ? null : s.id)
                      }
                      className="p-2 hover:bg-gray-100 rounded-lg transition ml-4"
                    >
                      <EllipsisIcon className="size-6 text-black" />
                    </button>
                  </div>

                  <div
                    ref={openMenuId === s.id ? menuRef : null}
                    className={`absolute right-0 top-0 bottom-0 flex items-center gap-2 pr-5 transition-all duration-300 ease-out ${
                      openMenuId === s.id
                        ? "translate-x-0 opacity-100"
                        : "translate-x-full opacity-0 pointer-events-none"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(s.id);
                        setOpenMenuId(null);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(s)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center gap-2"
                    >
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
            <MapPinIcon className="w-20 h-20" />
          </div>
          <p className="text-gray-500 font-medium text-lg">
            No stop locations added yet
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Create your first stop above to get started
          </p>
        </div>
      )}

      {deletingStop && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 pt-8 pb-6 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <MapPinIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Delete Stop
              </h3>
              <p className="text-gray-600">
                This will permanently delete{" "}
                <span className="font-semibold text-gray-900">
                  {deletingStop.name}
                </span>
              </p>
            </div>

            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type the stop name to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmName}
                  onChange={(e) => setDeleteConfirmName(e.target.value)}
                  placeholder={deletingStop.name}
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
                  I understand this action cannot be undone and all data will be
                  permanently deleted
                </span>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeletingStop(null)}
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <Form method="post" action="/dashboard/admin?page=stops" className="inline">
                <AuthenticityTokenInput />
                <input type="hidden" name="intent" value="deleteStop" />
                <input type="hidden" name="id" value={deletingStop.id} />
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
