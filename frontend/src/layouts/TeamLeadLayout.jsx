import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const TeamLeadLayout = () => {
  return (
    <div>

      <Navbar />

      <div className="p-6">
        <Outlet />
      </div>

    </div>
  );
};

export default TeamLeadLayout;