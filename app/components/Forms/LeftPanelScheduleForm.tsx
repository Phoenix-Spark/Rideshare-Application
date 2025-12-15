import { Link } from "react-router";

export default function LeftPanelScheduleForm() {
  return (
    <div className="mt-2 flex">
      <Link
        to="/dashboard/schedule"
        className="w-full py-2 text-center rounded font-semibold text-white bg-blue-700 hover:bg-blue-800">
        Schedule Pickup
      </Link>
    </div>
  );
}
