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
import SelfAssignedTasks from "../pages/tasks/SelfAssignedTasks";
import ProfileImageRequests
  from "../pages/profileRequests/ProfileImageRequests";
import ChatPage from "../pages/chat/ChatPage";

/* Employee Pages */
import EmployeeDashboard from "../pages/employees/EmployeeDashboard";
import MyTasks from "../pages/employees/MyTasks";
import MyReports from "../pages/employees/MyReports";
import MyAttendance from "../pages/employees/MyAttendance";
import MyProfile from "../pages/employees/MyProfile";
import EmployeeProfile
  from "../pages/employees/EmployeeProfile";
import EmployeePendingTasks from "../pages/tasks/EmployeePendingTasks";
import EmployeeCompletedTasks from "../pages/tasks/EmployeeCompletedTasks";

/* Company Admin */
import CompanyAdminDashboard from "../pages/companyAdmin/CompanyAdminDashboard";

/* Team Lead */
import TeamLeadDashboard from "../pages/teamLead/TeamLeadDashboard";
// import TeamMembers from "../pages/teamLead/TeamMembers";

/* Layouts */
import AdminLayout from "../layouts/AdminLayout";
import CompanyAdminLayout from "../layouts/CompanyAdminLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

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
                  "SUPER_ADMIN", "OFFICE_MANAGER"
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
                  "OFFICE_MANAGER",
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

          <Route
            path="/employee-profile/:id"
            element={
              <EmployeeProfile />
            }
          />

          <Route
            path="/company-self-tasks"
            element={<SelfAssignedTasks />}
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

        {/* <Route
          path="/office-dashboard"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute
                allowedRoles={[
                  "OFFICE_MANAGER"
                ]}
              >
                <Dashboard />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        /> */}

        {/* TEAM LEAD */}

        <Route
          element={
            <ProtectedRoute>
              <RoleProtectedRoute
                allowedRoles={[
                  "EMPLOYEE",
                  "TEAM_LEAD", "COMPANY_ADMIN", "SUPER_ADMIN", "OFFICE_MANAGER"
                ]}
              >
                <EmployeeLayout />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        >
          <Route
            path="/employee-dashboard"
            element={<EmployeeDashboard />}
          />

          <Route
            path="/team-dashboard"
            element={<TeamLeadDashboard />}
          />

          <Route
            path="/my-tasks"
            element={<MyTasks />}
          />

          <Route
            path="/my-reports"
            element={<MyReports />}
          />

          <Route
            path="/my-attendance"
            element={<MyAttendance />}
          />

          <Route
            path="/my-profile"
            element={<MyProfile />}
          />

          <Route
            path="/chat"
            element={<ChatPage />}
          />

          <Route
            path="/employee/pending-tasks"
            element={<EmployeePendingTasks />}
          />

          <Route
            path="/employee/completed-tasks"
            element={<EmployeeCompletedTasks />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;