import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

const CompanyAdminLayout = () => {
  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-6">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default CompanyAdminLayout;