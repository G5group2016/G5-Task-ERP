import {
    useEffect,
    useState
} from "react";
import { Link } from "react-router-dom";

import {
    getCompanyAdminDashboard
} from "../../services/dashboardService";

import toast from "react-hot-toast";

const CompanyAdminDashboard = () => {

    const [stats,
        setStats] =
        useState(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard =
        async () => {

            try {

                const data =
                    await getCompanyAdminDashboard();

                setStats(data);

            } catch {

                toast.error(
                    "Failed to load dashboard"
                );

            }
        };

    return (
        <div>

            <h1 className="text-4xl font-bold mb-8">
                Company Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">

                <div className="bg-slate-800 p-6 rounded-xl">
                    <h3>Employees</h3>
                    <p className="text-4xl font-bold mt-2">
                        {stats?.totalEmployees || 0}
                    </p>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl">
                    <h3>Active Tasks</h3>
                    <p className="text-4xl font-bold mt-2">
                        {stats?.activeTasks || 0}
                    </p>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl">
                    <h3>Completed</h3>
                    <p className="text-4xl font-bold mt-2">
                        {stats?.completedTasks || 0}
                    </p>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl">
                    <h3>Reports</h3>
                    <p className="text-4xl font-bold mt-2">
                        {stats?.reportsSubmitted || 0}
                    </p>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl">
                    <h3>Attendance Today</h3>
                    <p className="text-4xl font-bold mt-2">
                        {stats?.attendanceToday || 0}
                    </p>
                </div>

            </div>

            <h2 className="text-2xl font-bold mt-10 mb-5">
  Quick Actions
</h2>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

  <Link
    to="/employees"
    className="bg-slate-800 p-6 rounded-xl"
  >
    Manage Employees
  </Link>

  <Link
    to="/tasks"
    className="bg-slate-800 p-6 rounded-xl"
  >
    Manage Tasks
  </Link>

  <Link
    to="/reports"
    className="bg-slate-800 p-6 rounded-xl"
  >
    Reports
  </Link>

  <Link
    to="/attendance"
    className="bg-slate-800 p-6 rounded-xl"
  >
    Attendance
  </Link>

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

export default CompanyAdminDashboard;