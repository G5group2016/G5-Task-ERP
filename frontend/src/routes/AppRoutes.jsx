import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";

/* Super Admin */
import Dashboard from "../pages/dashboard/Dashboard";
import CompanyList from "../pages/companies/CompanyList";

/* Shared Pages */
import EmployeeList from "../pages/employees/EmployeeList";
import TaskList from "../pages/tasks/TaskList";
import ReportList from "../pages/reports/ReportList";
import Attendance from "../pages/attendance/Attendance";
import PendingTasks from "../pages/tasks/PendingTasks";
import CompletedTasks from "../pages/tasks/CompletedTasks";
import ProfileImageRequests
  from "../pages/profileRequests/ProfileImageRequests";

/* Employee Pages */
import EmployeeDashboard from "../pages/employees/EmployeeDashboard";
import MyTasks from "../pages/employees/MyTasks";
import MyReports from "../pages/employees/MyReports";
import MyAttendance from "../pages/employees/MyAttendance";
import MyProfile from "../pages/employees/MyProfile";

/* Company Admin */
import CompanyAdminDashboard from "../pages/companyAdmin/CompanyAdminDashboard";

/* Team Lead */
import TeamLeadDashboard from "../pages/teamLead/TeamLeadDashboard";
// import TeamMembers from "../pages/teamLead/TeamMembers";

/* Layouts */
import AdminLayout from "../layouts/AdminLayout";
import CompanyAdminLayout from "../layouts/CompanyAdminLayout";

/* Route Protection */
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* SUPER ADMIN ONLY */}

        <Route
          element={
            <ProtectedRoute>
              <RoleProtectedRoute
                allowedRoles={[
                  "SUPER_ADMIN",
                ]}
              >
                <AdminLayout />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/companies"
            element={<CompanyList />}
          />
        </Route>

        {/* SUPER ADMIN + COMPANY ADMIN */}

        <Route
          element={
            <ProtectedRoute>
              <RoleProtectedRoute
                allowedRoles={[
                  "SUPER_ADMIN",
                  "COMPANY_ADMIN",
                ]}
              >
                <AdminLayout />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        >
          <Route
            path="/employees"
            element={<EmployeeList />}
          />

          <Route
            path="/tasks"
            element={<TaskList />}
          />

          <Route
            path="/reports"
            element={<ReportList />}
          />

          <Route
            path="/attendance"
            element={<Attendance />}
          />

          <Route
            path="/pending-tasks"
            element={<PendingTasks />}
          />

          <Route
            path="/completed-tasks"
            element={
              <CompletedTasks />
            }
          />

          <Route
            path="/profile-image-requests"
            element={
              <ProfileImageRequests />
            }
          />
        </Route>

        {/* COMPANY ADMIN */}

        <Route
          element={
            <ProtectedRoute>
              <RoleProtectedRoute
                allowedRoles={[
                  "COMPANY_ADMIN",
                ]}
              >
                <CompanyAdminLayout />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        >
          <Route
            path="/company-dashboard"
            element={
              <CompanyAdminDashboard />
            }
          />
        </Route>

        {/* TEAM LEAD */}

        <Route
          path="/team-dashboard"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute
                allowedRoles={[
                  "TEAM_LEAD",
                ]}
              >
                <TeamLeadDashboard />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/team-members"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute
                allowedRoles={[
                  "TEAM_LEAD",
                ]}
              >
                <TeamMembers />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        /> */}

        {/* EMPLOYEE */}

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute
                allowedRoles={[
                  "EMPLOYEE",
                ]}
              >
                <EmployeeDashboard />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-tasks"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute
                allowedRoles={[
                  "EMPLOYEE",
                  "TEAM_LEAD",
                  "COMPANY_ADMIN",
                ]}
              >
                <MyTasks />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reports"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute
                allowedRoles={[
                  "EMPLOYEE",
                  "TEAM_LEAD",
                  "COMPANY_ADMIN",
                ]}
              >
                <MyReports />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-attendance"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute
                allowedRoles={[
                  "EMPLOYEE",
                  "TEAM_LEAD",
                  "COMPANY_ADMIN",
                ]}
              >
                <MyAttendance />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute
                allowedRoles={[
                  "EMPLOYEE",
                  "TEAM_LEAD",
                  "COMPANY_ADMIN",
                ]}
              >
                <MyProfile />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;