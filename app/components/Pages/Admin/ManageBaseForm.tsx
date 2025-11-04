import { AdminIcon } from "~/components/Icons/AdminIcon";

export default function ManageBaseForm() {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Manage Existing Bases
        </h3>
        <p className="text-gray-600">
          View, update, or remove bases from the system.
        </p>
      </div>

      <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center bg-gray-50/50">
        <div className="text-gray-400 flex justify-center mb-3">
          <AdminIcon className="size-20" />
        </div>
        <p className="text-gray-500 font-medium">No bases added yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Create your first base above to get started
        </p>
      </div>
    </section>
  );
}
