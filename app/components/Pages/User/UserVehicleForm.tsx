import { Form } from "react-router";
import VehicleDescriptionForm from "~/components/Forms/VehicleDescriptionForm";
import { XMarkIcon } from "~/components/Icons/XMarkIcon";

export default function UserVehicleForm({ user, vehicles }: any) {
  return (
    <div className="space-y-8">
      <Form method="post" action="/dashboard/settings" className="space-y-6">
        <input type="hidden" name="intent" value="vehicle-enable" />

        <div className="border-l-4 border-indigo-500 pl-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            Vehicle Management
          </h3>
          <p className="text-gray-500 text-sm">
            Register and manage your vehicles
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 shadow-md border border-green-100 flex items-center justify-between">
          <div>
            <span className="text-base font-semibold text-gray-900 block">
              Enable Driver Mode
            </span>
            <span className="text-sm text-gray-500 mt-1 block">
              Activate driver capabilities and vehicle registration
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isDriver"
              value="true"
              defaultChecked={!!user?.isDriver}
              className="sr-only peer"
              onChange={(e) => e.currentTarget.form?.submit()}
            />
            <div
              className="w-14 h-7 bg-gray-300 rounded-full peer-focus:ring-4 peer-focus:ring-green-100 
                         peer-checked:bg-gradient-to-r peer-checked:from-green-600 peer-checked:to-emerald-500 
                         after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white 
                         after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-7 
                         after:border after:border-gray-200 relative"
            ></div>
          </label>
        </div>
      </Form>

      {user?.isDriver && vehicles?.length === 0 && (
          <div className="bg-red-100 p-2 rounded-lg border border-1 border-red-400">
          <p className="text-black">Please add a vehicle to your account to complete driver setup.</p>
        </div>
        )}

      {user?.isDriver && vehicles?.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-gray-900">
            Registered Vehicles
          </h4>
          <div className="space-y-4">
            {vehicles.map((vehicle: any) => (
              <Form method="post" action="/dashboard/settings">
                <input type="hidden" name="intent" value="vehicle-delete" />
                <input type="hidden" name="id" value={vehicle.id} />
                <div
                  key={vehicle.id}
                  className=" flex bg-white rounded-2xl p-5 border border-gray-200 shadow hover:shadow-lg transition duration-300"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-gray-700">
                    <p>
                      <span className="font-medium">Year:</span> {vehicle.year}
                    </p>
                    <p>
                      <span className="font-medium">Make:</span> {vehicle.make}
                    </p>
                    <p>
                      <span className="font-medium">Model:</span>{" "}
                      {vehicle.model}
                    </p>
                    <p>
                      <span className="font-medium">Color:</span>{" "}
                      {vehicle.color}
                    </p>
                    <p>
                      <span className="font-medium">Plate:</span>{" "}
                      {vehicle.plate}
                    </p>
                    <p>
                      <span className="font-medium">Added:</span>{" "}
                      {new Date(vehicle.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="ml-5 px-3 rounded-full text-gray-600 hover:text-white hover:bg-red-500 transition-all duration-300 transform"
                    aria-label="Delete vehicle"
                  >
                    <XMarkIcon className="size-6" />
                  </button>
                </div>
              </Form>
            ))}
          </div>
        </div>
      )}

      {user?.isDriver && vehicles.length === 0 && (
        <Form method="post" action="/dashboard/settings" className="space-y-4">
          <input type="hidden" name="intent" value="vehicle" />
          <VehicleDescriptionForm />
        </Form>
      )}
    </div>
  );
}
