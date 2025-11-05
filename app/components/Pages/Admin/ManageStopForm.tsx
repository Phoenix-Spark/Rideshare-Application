import { MapPinIcon } from "~/components/Icons/MapPinIcon";

export default function ManageStopForm() {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Manage Stop Locations
        </h3>
        <p className="text-gray-600">
          View, edit, or delete stop locations in the system.
        </p>
      </div>

      <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center bg-gray-50/50">
        <div className="text-gray-400 text-4xl mb-3 flex justify-center">
          <MapPinIcon className="size-10" />
        </div>
        <p className="text-gray-500 font-medium">No stop locations added yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Create your first stop above to get started
        </p>
      </div>
    </section>
  );
}
