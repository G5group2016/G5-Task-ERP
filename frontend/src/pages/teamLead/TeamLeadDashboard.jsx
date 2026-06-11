import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

const TeamLeadDashboard = () => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div>
      <Navbar />

      <h1 className="text-4xl font-bold mb-6">
        Team Lead Dashboard
      </h1>

      <div className="bg-slate-800 p-6 rounded-xl mb-6">

        <p>
          Welcome {user?.fullName}
        </p>

        <p className="mt-2">
          Team Lead Panel
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* <Link
          to="/team-members"
          className="bg-slate-800 p-6 rounded-xl"
        >
          My Team
        </Link> */}

        <Link
          to="/my-tasks"
          className="bg-slate-800 p-6 rounded-xl"
        >
          My Tasks
        </Link>

        <Link
          to="/my-reports"
          className="bg-slate-800 p-6 rounded-xl"
        >
          My Reports
        </Link>

        <Link
          to="/my-attendance"
          className="bg-slate-800 p-6 rounded-xl"
        >
          My Attendance
        </Link>

        <Link
          to="/my-profile"
          className="bg-slate-800 p-6 rounded-xl"
        >
          My Profile
        </Link>

      </div>

    </div>
  );
};

export default TeamLeadDashboard;