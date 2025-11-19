import RightSideUserPanelForm from "./RightSideUserPanelForm";
import LeftSideRidePanelForm from "./LeftRidePanelForm";
import { Outlet, useNavigate } from "react-router";
import MiddlePanelForm from "./MiddlePanelForm";

export default function Dashboard({ user, station, accepted, activeRequests, requestInfo }: any) {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen">
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-[90%] max-w-4xl">
        <MiddlePanelForm user={user}/>
      </div>

      <div className="absolute top-8 left-0 h-full z-10">
        <LeftSideRidePanelForm 
          user={user} 
          station={station}
          accepted={accepted}
          activeRequests={activeRequests} 
          requestInfo={requestInfo}
          onLogout={() => navigate("/logout")}
        />
      </div>

      <div className="hidden md:block absolute top-16 right-8 h-full md:z-10">
        <RightSideUserPanelForm user={user} />
      </div>
      <Outlet />
    </div>
  );
}

