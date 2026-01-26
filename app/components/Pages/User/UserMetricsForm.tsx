import { useState } from "react";

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const STATE_GAS_PRICES: Record<string, number> = {
  Alabama: 2.53,
  Alaska: 3.48,
  Arizona: 2.97,
  Arkansas: 2.43,
  California: 4.22,
  Colorado: 2.62,
  Connecticut: 2.85,
  Delaware: 2.93,
  Florida: 2.89,
  Georgia: 2.70,
  Hawaii: 4.41,
  Idaho: 2.79,
  Illinois: 2.99,
  Indiana: 2.86,
  Iowa: 2.57,
  Kansas: 2.48,
  Kentucky: 2.60,
  Louisiana: 2.47,
  Maine: 2.87,
  Maryland: 2.98,
  Massachusetts: 2.88,
  Michigan: 2.88,
  Minnesota: 2.69,
  Mississippi: 2.44,
  Missouri: 2.50,
  Montana: 2.74,
  Nebraska: 2.58,
  Nevada: 3.36,
  "New Hampshire": 2.81,
  "New Jersey": 2.76,
  "New Mexico": 2.67,
  "New York": 2.98,
  "North Carolina": 2.73,
  "North Dakota": 2.54,
  Ohio: 2.88,
  Oklahoma: 2.41,
  Oregon: 3.35,
  Pennsylvania: 3.02,
  "Rhode Island": 2.82,
  "South Carolina": 2.63,
  "South Dakota": 2.62,
  Tennessee: 2.52,
  Texas: 2.46,
  Utah: 2.63,
  Vermont: 2.98,
  Virginia: 2.85,
  Washington: 3.84,
  "West Virginia": 2.82,
  Wisconsin: 2.56,
  Wyoming: 2.57,
};

function calculateGasCost(distance: number, state: string, mpg: number = 25): number {
  const gasPrice = STATE_GAS_PRICES[state] || 3.50;
  const gallons = distance / mpg;
  return gallons * gasPrice;
}

function calculateRideDuration(createdAt: string, droppedOffAt: string | null): number {
  if (!droppedOffAt) return 0;
  const start = new Date(createdAt).getTime();
  const end = new Date(droppedOffAt).getTime();
  return (end - start) / (1000 * 60);
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

export default function UserMetricsForm({ rides }: any) {
  const [activeTab, setActiveTab] = useState<"taken" | "given">("taken");
  const [mpg, setMpg] = useState<number>(25);

  const allRides = rides.request || [];

  const ridesTaken = allRides.filter((r: any) => r.user?.email);
  const ridesGiven = allRides.filter((r: any) => r.driver?.email && !r.user?.email);

  const ridesTakenCompleted = ridesTaken.filter((r: any) => r.status === "Completed");
  const ridesTakenCancelled = ridesTaken.filter((r: any) => r.status === "Cancelled").length;
  const ridesTakenPending = ridesTaken.filter((r: any) => r.status === "Pending").length;
  const ridesTakenInProgress = ridesTaken.filter((r: any) => r.status === "In-Progress").length;

  const ridesGivenCompleted = ridesGiven.filter((r: any) => r.status === "Completed");
  const ridesGivenCancelled = ridesGiven.filter((r: any) => r.status === "Cancelled").length;
  const ridesGivenPending = ridesGiven.filter((r: any) => r.status === "Pending").length;
  const ridesGivenInProgress = ridesGiven.filter((r: any) => r.status === "In-Progress").length;

  const calculateTotals = (rides: any[]) => {
    let totalDistance = 0;
    let totalCost = 0;
    let totalTime = 0;

    rides.forEach((ride: any) => {
      if (ride.pickup && ride.dropoff) {
        const distance = calculateDistance(
          parseFloat(ride.pickup.latitude),
          parseFloat(ride.pickup.longitude),
          parseFloat(ride.dropoff.latitude),
          parseFloat(ride.dropoff.longitude)
        );
        totalDistance += distance;
        
        const state = ride.base?.state || "California";
        totalCost += calculateGasCost(distance, state, mpg);
      }
      totalTime += calculateRideDuration(ride.createdAt, ride.droppedOffAt);
    });

    return { totalDistance, totalCost, totalTime };
  };

  const ridesTakenTotals = calculateTotals(ridesTakenCompleted);
  const ridesGivenTotals = calculateTotals(ridesGivenCompleted);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "In-Progress":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const currentRides = activeTab === "taken" ? ridesTaken : ridesGiven;
  const sortedRides = [...currentRides].sort(
    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const currentTotals = activeTab === "taken" ? ridesTakenTotals : ridesGivenTotals;
  const currentCompleted = activeTab === "taken" ? ridesTakenCompleted : ridesGivenCompleted;

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-indigo-500 pl-6">
        <h3 className="text-3xl font-bold text-gray-900 mb-1">Ride Metrics</h3>
        <p className="text-gray-500 text-sm">
          View your ride history, statistics, and estimated costs.
        </p>
      </div>

      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab("taken")}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            activeTab === "taken"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Rides Taken
        </button>
        <button
          onClick={() => setActiveTab("given")}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            activeTab === "given"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Rides Given
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
          <p className="text-sm text-purple-600 font-medium">Total Distance</p>
          <p className="text-3xl font-bold text-purple-700 mt-1">
            {currentTotals.totalDistance.toFixed(1)}
          </p>
          <p className="text-xs text-purple-600 mt-1">miles</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
          <p className="text-sm text-emerald-600 font-medium">Gas Cost</p>
          <p className="text-3xl font-bold text-emerald-700 mt-1">
            ${currentTotals.totalCost.toFixed(2)}
          </p>
          <p className="text-xs text-emerald-600 mt-1">estimated total</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-600 font-medium">
            {activeTab === "taken" ? "Time Carpooling" : "Time Driving"}
          </p>
          <p className="text-3xl font-bold text-blue-700 mt-1">
            {formatDuration(currentTotals.totalTime)}
          </p>
          <p className="text-xs text-blue-600 mt-1">total ride time</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <p className="text-sm text-orange-600 font-medium">Average Time</p>
          <p className="text-3xl font-bold text-orange-700 mt-1">
            {currentCompleted.length > 0
              ? formatDuration(currentTotals.totalTime / currentCompleted.length)
              : "0m"}
          </p>
          <p className="text-xs text-orange-600 mt-1">per completed ride</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-600 font-medium">Completed</p>
          <p className="text-3xl font-bold text-green-700 mt-1">
            {currentCompleted.length}
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600 font-medium">Cancelled</p>
          <p className="text-3xl font-bold text-red-700 mt-1">
            {activeTab === "taken" ? ridesTakenCancelled : ridesGivenCancelled}
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-600 font-medium">Pending</p>
          <p className="text-3xl font-bold text-yellow-700 mt-1">
            {activeTab === "taken" ? ridesTakenPending : ridesGivenPending}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-600 font-medium">In Progress</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">
            {activeTab === "taken" ? ridesTakenInProgress : ridesGivenInProgress}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-gray-900">Ride History</h4>
            <p className="text-sm text-gray-500">
              Total: {currentRides.length}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {sortedRides.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-12">
              No {activeTab === "taken" ? "rides taken" : "rides given"} yet.
            </p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {activeTab === "taken" ? "Driver" : "Passenger"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedRides.map((ride: any) => {
                  let distance = 0;
                  let cost = 0;
                  let duration = 0;
                  
                  if (ride.pickup && ride.dropoff) {
                    distance = calculateDistance(
                      parseFloat(ride.pickup.latitude),
                      parseFloat(ride.pickup.longitude),
                      parseFloat(ride.dropoff.latitude),
                      parseFloat(ride.dropoff.longitude)
                    );
                    
                    const state = ride.base?.state || "California";
                    cost = calculateGasCost(distance, state, mpg);
                  }
                  
                  if (ride.createdAt && ride.droppedOffAt) {
                    duration = calculateRideDuration(ride.createdAt, ride.droppedOffAt);
                  }

                  return (
                    <tr key={ride.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ride.status)}`}>
                          {ride.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {new Date(ride.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {activeTab === "taken" && ride.driver ? (
                          <div className="max-w-[180px]">
                            <div className="font-medium truncate">{ride.driver.firstName} {ride.driver.lastName}</div>
                            <div className="text-xs text-gray-500 truncate">{ride.driver.email}</div>
                          </div>
                        ) : activeTab === "given" && ride.user ? (
                          <div className="max-w-[180px]">
                            <div className="font-medium truncate">{ride.user.firstName} {ride.user.lastName}</div>
                            <div className="text-xs text-gray-500 truncate">{ride.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="max-w-[200px] truncate">{ride.pickup?.name || "?"}</div>
                        <div className="text-gray-500 max-w-[200px] truncate">→ {ride.dropoff?.name || "?"}</div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {distance > 0 ? `${distance.toFixed(1)} mi` : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {duration > 0 ? formatDuration(duration) : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-emerald-600 whitespace-nowrap">
                        {cost > 0 ? `$${cost.toFixed(2)}` : "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}