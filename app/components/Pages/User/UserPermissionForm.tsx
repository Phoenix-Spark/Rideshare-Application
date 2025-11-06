export default function UserPermissionForm({ user }: any) {
  const permissions = [
    {
      label: "Administrator Access",
      description: "Grant full system access and management capabilities",
      key: "isAdmin",
    },
    {
      label: "Driver Access",
      description: "Grant access to drive passengers",
      key: "isDriver",
    },
    {
      label: "Passenger Access",
      description: "Grant access to request rides from drivers",
      key: "isPassenger",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-indigo-500 pl-6">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">User Permissions</h3>
        <p className="text-gray-500">Manage administrative access and roles</p>
      </div>

      <div className="space-y-4">
        {permissions.map(({ label, description, key }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex-1">
              <span className="block text-base font-semibold text-gray-900">{label}</span>
              <span className="block text-sm text-gray-500 mt-1">{description}</span>
            </div>

            <label className="relative inline-flex items-center cursor-not-allowed">
              <input
                type="checkbox"
                name={key}
                defaultChecked={user?.[key]}
                className="sr-only peer"
                disabled
              />
              <div className="w-14 h-7 bg-gray-300 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-indigo-500 relative transition-colors duration-300">
                <span
                  className={`absolute top-1 left-1 h-5 w-5 bg-white rounded-full transition-transform duration-300 ${
                    user?.[key] ? "translate-x-7" : ""
                  }`}
                ></span>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
