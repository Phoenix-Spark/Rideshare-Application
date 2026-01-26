import { useEffect, useState } from "react";
import { useFetcher, useSearchParams } from "react-router";
import { displayName } from "../Utilities/formatName";

const ITEMS_PER_PAGE = 25;

function ridesToCSV(rides: any[]): string {
  const headers = [
    "Passenger",
    "Pickup",
    "Dropoff",
    "Driver",
    "Status",
    "Date",
  ];
  const rows = rides.map((ride) => [
    displayName(ride.user?.firstName, ride.user?.lastName),
    ride.pickup?.name || "",
    ride.dropoff?.name || "",
    ride.driver ? displayName(ride.driver.firstName, ride.driver.lastName) : "",
    ride.status || "",
    ride.createdAt ? new Date(ride.createdAt).toLocaleDateString() : "",
  ]);

  const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
  const csvContent = [
    headers.map(escape).join(","),
    ...rows.map((row) => row.map(escape).join(",")),
  ].join("\n");

  return csvContent;
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface CreateRidesTableProps {
  rides: any[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export default function CreateRidesTable({
  rides,
  totalCount,
  totalPages,
  currentPage,
}: CreateRidesTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const searchQuery = searchParams.get("search") || "";
  const fetcher = useFetcher();
  const isExporting = fetcher.state !== "idle";
  const [pendingExport, setPendingExport] = useState(false);

  useEffect(() => {
    if (pendingExport && fetcher.data?.rides && fetcher.state === "idle") {
      const csv = ridesToCSV(fetcher.data.rides);
      const filename = searchQuery
        ? `rides-${searchQuery}-${new Date().toISOString().split("T")[0]}.csv`
        : `rides-all-${new Date().toISOString().split("T")[0]}.csv`;
      downloadCSV(csv, filename);
      setPendingExport(false);
    }
  }, [fetcher.data, fetcher.state, searchQuery, pendingExport]);

  const handleExport = () => {
    setPendingExport(true);
    fetcher.submit({ search: searchQuery }, { method: "post" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set("search", searchInput.trim());
    } else {
      newParams.delete("search");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleClear = () => {
    setSearchInput("");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <div className="text-black">
      <div className="flex items-center justify-between gap-4 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div>
            <label
              htmlFor="nameSearch"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search by Name
            </label>
            <input
              id="nameSearch"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter name..."
              className="block w-64 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="self-end px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="self-end px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Clear
            </button>
          )}
        </form>
        <div>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="self-end px-4 py-2 mr-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting
              ? "Exporting..."
              : !searchQuery
                ? "Export All"
                : `Export for ${searchQuery}`}
          </button>
        </div>
      </div>

      <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 font-medium text-gray-900">Passenger</th>
            <th className="px-6 py-4 font-medium text-gray-900">Pickup</th>
            <th className="px-6 py-4 font-medium text-gray-900">Dropoff</th>
            <th className="px-6 py-4 text-center font-medium text-gray-900">
              Driver
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-900">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {rides?.map((ride: any, index: number) => (
            <tr key={index}>
              <td>{displayName(ride.user?.firstName, ride.user?.lastName)}</td>
              <td>{ride.pickup.name}</td>
              <td>{ride.dropoff.name}</td>
              <td>
                {ride.driver
                  ? displayName(ride.driver.firstName, ride.driver.lastName)
                  : ""}
              </td>
              <td
                className={`text-center ${ride.status === "Completed" ? "bg-green-100" : ride.status === "Cancelled" ? "bg-red-100" : "bg-gray-100"}`}
              >
                {ride.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}-
            {Math.min(startIndex + ITEMS_PER_PAGE, totalCount)} of {totalCount}{" "}
            results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
