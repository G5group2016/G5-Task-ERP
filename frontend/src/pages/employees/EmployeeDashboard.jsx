import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getEmployeeDashboard } from "../../services/dashboardService";

const EmployeeDashboard = () => {

  const [stats, setStats] =
    useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard =
    async () => {

      try {

        const data =
          await getEmployeeDashboard();

        setStats(data);

      } catch (error) {

        toast.error(
          "Failed to load dashboard"
        );

      }
    };

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        Employee Dashboard
      </h1>

      {/* Analytics Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <div className="bg-slate-800 p-6 rounded-xl">
          <h3>Assigned Tasks</h3>

          <p className="text-4xl font-bold mt-3">
            {stats?.assignedTasks || 0}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h3>Completed Tasks</h3>

          <p className="text-4xl font-bold mt-3">
            {stats?.completedTasks || 0}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h3>Reports Submitted</h3>

          <p className="text-4xl font-bold mt-3">
            {stats?.reportsSubmitted || 0}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h3>Attendance Days</h3>

          <p className="text-4xl font-bold mt-3">
            {stats?.attendanceDays || 0}
          </p>
        </div>

      </div>

      {/* Quick Actions */}

      <h2 className="text-2xl font-bold mb-5">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <Link
          to="/my-tasks"
          className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition"
        >
          <h3 className="font-bold text-lg">
            My Tasks
          </h3>

          <p className="text-slate-400 mt-2">
            View assigned tasks
          </p>
        </Link>

        <Link
          to="/my-reports"
          className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition"
        >
          <h3 className="font-bold text-lg">
            My Reports
          </h3>

          <p className="text-slate-400 mt-2">
            Submit work reports
          </p>
        </Link>

        <Link
          to="/my-attendance"
          className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition"
        >
          <h3 className="font-bold text-lg">
            My Attendance
          </h3>

          <p className="text-slate-400 mt-2">
            Check attendance records
          </p>
        </Link>

        <Link
          to="/my-profile"
          className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition"
        >
          <h3 className="font-bold text-lg">
            My Profile
          </h3>

          <p className="text-slate-400 mt-2">
            Manage profile settings
          </p>
        </Link>

      </div>

    </div>
  );
};

export default EmployeeDashboard;