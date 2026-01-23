import RightSideUserPanelForm from "./RightSideUserPanelForm";
import LeftSideRidePanelForm from "./LeftRidePanelForm";
import { Outlet, useNavigate } from "react-router";
import MiddlePanelForm from "./MiddlePanelForm";

export default function Dashboard({
  user,
  station,
  accepted,
  activeRequests,
  vehicles,
  requestInfo,
  bases,
  actionData,
  activePassengerRequests
}: any) {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-[90%] max-w-4xl">
        <MiddlePanelForm user={user} vehicles={vehicles} bases={bases}/>
      </div>

      <div className="absolute top-0 left-0 h-full z-10">
        <LeftSideRidePanelForm
          user={user}
          station={station}
          accepted={accepted}
          activeRequests={activeRequests}
          activePassengerRequests={activePassengerRequests}
          actionData={actionData}
          requestInfo={requestInfo}
          onLogout={() => navigate("/logout")}
        />
      </div>

      <div className="hidden md:block absolute top-8 right-8 h-full md:z-10">
        <RightSideUserPanelForm user={user} />
      </div>
      <div className="hidden md:block absolute top-25 right-8 max-w-[350px]">
      {/* <div className="flex items-start gap-3 mt-5 p-4 w-full max-w-[350px] bg-gray-300/70 rounded-xl border border-gray-500">
        <span className="text-black text-sm text-pretty">
          This platform is a community-driven tool, not a guaranteed or
          on-demand service. Please keep in mind that everything depends on the
          availability, participation, and cooperation of community members.
        </span>
      </div> */}
      </div>
      <Outlet />
    </div>
  );
}
