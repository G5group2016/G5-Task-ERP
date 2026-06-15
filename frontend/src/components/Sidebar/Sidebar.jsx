import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const displayDesignation =
    role === "SUPER_ADMIN"
      ? "HR"
      : user?.designation || role;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const roleLabels = {
    SUPER_ADMIN: "Super Admin",
    COMPANY_ADMIN: "Company Admin",
    OFFICE_MANAGER: "Office Manager",
    TEAM_LEAD: "Team Lead",
    EMPLOYEE: "Employee",
  };

  const roleColors = {
    SUPER_ADMIN: "#6366F1",
    COMPANY_ADMIN: "#10B981",
    OFFICE_MANAGER: "#06B6D4",
    TEAM_LEAD: "#F59E0B",
    EMPLOYEE: "#94A3B8",
  };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 14px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: isActive ? "600" : "400",
          color: isActive ? "#fff" : "#94A3B8",
          background: isActive
            ? "linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(99,102,241,0.08) 100%)"
            : "transparent",
          borderLeft: isActive ? "3px solid #6366F1" : "3px solid transparent",
          textDecoration: "none",
          transition: "all 0.18s ease",
          letterSpacing: "0.01em",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.background = "rgba(99,102,241,0.06)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.color = "#94A3B8";
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        {children}
      </Link>
    );
  };

  const SectionLabel = ({ children }) => (
    <p
      style={{
        fontSize: "10px",
        fontWeight: "700",
        letterSpacing: "0.1em",
        color: "#475569",
        textTransform: "uppercase",
        padding: "16px 14px 6px",
        marginTop: "4px",
      }}
    >
      {children}
    </p>
  );

  return (
    <div
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "#080D1A",
        borderRight: "1px solid #1E293B",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', system-ui, sans-serif",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid #1E293B",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          {/* <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: "800",
              color: "#fff",
              letterSpacing: "-0.5px",
              boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
            }}
          >
            G5
          </div> */}
          <div
            style={{
              width: "32px",
              height: "40px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // fontSize: "13px",
              fontWeight: "800",
              color: "#fff",
              // letterSpacing: "-0.5px",
              boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
            }}
          >
            <img
              src="./images/group-logo.png"
              alt="G5 Group Logo"
            // className="w-28 h-28 mx-auto mb-3 object-contain"
            />
          </div>
          <div>
            <p style={{ fontSize: "15px", fontWeight: "700", color: "#F1F5F9", margin: 0, letterSpacing: "-0.02em" }}>
              G5 Group
            </p>
            <p style={{ fontSize: "10px", color: "#475569", margin: 0, letterSpacing: "0.05em" }}>
              ENTERPRISE PLATFORM
            </p>
          </div>
        </div>

        {/* Role badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 10px",
            borderRadius: "20px",
            background: `${roleColors[role]}18`,
            border: `1px solid ${roleColors[role]}30`,
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: roleColors[role] || "#94A3B8",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: roleColors[role] || "#94A3B8",
              letterSpacing: "0.03em",
            }}
          >
            {displayDesignation}
          </span>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>

        {/* SUPER ADMIN */}
        {role === "SUPER_ADMIN" && (
          <>
            <SectionLabel>Overview</SectionLabel>
            <NavLink to="/dashboard">Dashboard</NavLink>

            <SectionLabel>Management</SectionLabel>
            <NavLink to="/companies">Companies</NavLink>
            <NavLink to="/employees">Employees</NavLink>
            <NavLink to="/tasks">Tasks</NavLink>

            <SectionLabel>Operations</SectionLabel>
            <NavLink to="/reports">Reports</NavLink>
            <NavLink to="/attendance">Attendance</NavLink>
            <NavLink to="/profile-image-requests">Profile Image Requests</NavLink>
            <SectionLabel>
              Personal
            </SectionLabel>
            <NavLink to="/my-profile">
              My Profile
            </NavLink>
            <NavLink to="/chat">
              Chat
            </NavLink>
          </>
        )}

        {/* COMPANY ADMIN */}
        {role === "COMPANY_ADMIN" && (
          <>
            <SectionLabel>Overview</SectionLabel>
            <NavLink to="/company-dashboard">Dashboard</NavLink>

            <SectionLabel>Management</SectionLabel>
            <NavLink to="/employees">Employees</NavLink>
            <NavLink to="/tasks">Tasks</NavLink>
            <NavLink to="/reports">Reports</NavLink>
            <NavLink to="/attendance">Attendance</NavLink>
            <NavLink to="/profile-image-requests">Profile Image Requests</NavLink>

            <SectionLabel>Personal</SectionLabel>
            <NavLink to="/my-tasks">My Tasks</NavLink>
            <NavLink to="/my-reports">My Reports</NavLink>
            <NavLink to="/my-attendance">My Attendance</NavLink>
            <NavLink to="/my-profile">My Profile</NavLink>
            <NavLink to="/chat">
              Chat
            </NavLink>
          </>
        )}

        {/* OFFICE MANAGER */}
        {role === "OFFICE_MANAGER" && (
          <>
            <SectionLabel>Overview</SectionLabel>
            <NavLink to="/dashboard">
              Dashboard
            </NavLink>

            <SectionLabel>Management</SectionLabel>
            <NavLink to="/employees">
              Employees
            </NavLink>

            <NavLink to="/tasks">
              Tasks
            </NavLink>

            <NavLink to="/reports">
              Reports
            </NavLink>

            <NavLink to="/attendance">
              Attendance
            </NavLink>

            <SectionLabel>
              Personal
            </SectionLabel>

            <NavLink to="/my-profile">
              My Profile
            </NavLink>
            <NavLink to="/chat">
              Chat
            </NavLink>

            {/* <NavLink to="/profile-image-requests">
              Profile Image Requests
            </NavLink> */}
          </>
        )}

        {/* TEAM LEAD */}
        {role === "TEAM_LEAD" && (
          <>
            <SectionLabel>Overview</SectionLabel>
            <NavLink to="/team-dashboard">Dashboard</NavLink>

            <SectionLabel>Personal</SectionLabel>
            <NavLink to="/my-tasks">My Tasks</NavLink>
            <NavLink to="/my-reports">My Reports</NavLink>
            <NavLink to="/my-attendance">My Attendance</NavLink>
            <NavLink to="/my-profile">My Profile</NavLink>
            <NavLink to="/chat">
              Chat
            </NavLink>
          </>
        )}

        {/* EMPLOYEE */}
        {role === "EMPLOYEE" && (
          <>
            <SectionLabel>Overview</SectionLabel>
            <NavLink to="/employee-dashboard">Dashboard</NavLink>

            <SectionLabel>Personal</SectionLabel>
            <NavLink to="/my-tasks">My Tasks</NavLink>
            <NavLink to="/my-reports">My Reports</NavLink>
            <NavLink to="/my-attendance">My Attendance</NavLink>
            <NavLink to="/my-profile">My Profile</NavLink>
            <NavLink to="/chat">
              Chat
            </NavLink>
          </>
        )}
      </div>

      {/* Footer / Logout */}
      <div style={{ padding: "12px 10px 20px", borderTop: "1px solid #1E293B" }}>
        <button
          onClick={logout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px",
            borderRadius: "8px",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#EF4444",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.18s ease",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.16)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;