import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

const quickActions = [
  // { to: "/team-members", label: "My Team",      icon: "👥", desc: "Manage your team members",  from: "#6366F1", to2: "#4F46E5" },
  { to: "/my-tasks",      label: "My Tasks",     icon: "⚡", desc: "View your assigned tasks",   from: "#F59E0B", to2: "#D97706" },
  { to: "/my-reports",    label: "My Reports",   icon: "📋", desc: "Submit work reports",        from: "#8B5CF6", to2: "#7C3AED" },
  { to: "/my-attendance", label: "My Attendance",icon: "🕐", desc: "Check attendance records",   from: "#10B981", to2: "#059669" },
  { to: "/my-profile",    label: "My Profile",   icon: "👤", desc: "Manage profile settings",    from: "#3B82F6", to2: "#2563EB" },
];

function getAvatarColor(name = "") {
  const colors = [
    ["#6366F1","#4F46E5"],["#8B5CF6","#7C3AED"],["#EC4899","#DB2777"],
    ["#F59E0B","#D97706"],["#10B981","#059669"],["#3B82F6","#2563EB"],
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function ActionCard({ action }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link
      to={action.to}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "18px 20px", borderRadius: 14, textDecoration: "none",
        background: isHovered ? "rgba(255,255,255,0.04)" : "#111827",
        border: isHovered ? `1px solid ${action.from}44` : "1px solid rgba(255,255,255,0.06)",
        boxShadow: isHovered
          ? `0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px ${action.from}22`
          : "0 2px 12px rgba(0,0,0,0.25)",
        transform: isHovered ? "translateY(-2px)" : "none",
        transition: "all 0.18s ease",
      }}
    >
      <span style={{
        width: 42, height: 42, borderRadius: 11, flexShrink: 0,
        background: `linear-gradient(135deg, ${action.from}28, ${action.to2}14)`,
        border: `1px solid ${action.from}35`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
      }}>
        {action.icon}
      </span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: isHovered ? "#F1F5F9" : "#CBD5E1", marginBottom: 3, letterSpacing: "-0.01em" }}>
          {action.label}
        </div>
        <div style={{ fontSize: 12, color: "#475569" }}>{action.desc}</div>
      </div>
    </Link>
  );
}

const TeamLeadDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [avatarFrom, avatarTo] = getAvatarColor(user?.fullName || "");
  const initials = (user?.fullName || "?")
    .split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#E2E8F0" }}>
      <Navbar />

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: "linear-gradient(135deg, #6366F1, #4F46E5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 0 24px rgba(99,102,241,0.4)",
          }}>
            🎯
          </div>
          <h1 style={{
            fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: "-0.025em",
            background: "linear-gradient(135deg, #F1F5F9 50%, #94A3B8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Team Lead Dashboard
          </h1>
        </div>
        <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>
          Manage your responsibilities and access your team tools.
        </p>
      </div>

      {/* Welcome card */}
      <div style={{
        background: "#111827", borderRadius: 16, overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)", marginBottom: 32, position: "relative",
      }}>
        <div style={{ height: 3, background: "linear-gradient(90deg, #6366F1 0%, #8B5CF6 60%, transparent 100%)" }} />
        <div style={{ padding: "22px 26px", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          {/* Avatar */}
          <div style={{
            width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
            background: `linear-gradient(135deg, ${avatarFrom}, ${avatarTo})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 800, color: "#fff",
            border: "2px solid rgba(99,102,241,0.35)",
            boxShadow: "0 0 20px rgba(99,102,241,0.2)", letterSpacing: "-0.02em",
          }}>
            {initials}
          </div>

          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#F1F5F9", marginBottom: 6, letterSpacing: "-0.01em" }}>
              Welcome back,{" "}
              <span style={{ background: "linear-gradient(135deg, #818CF8, #6366F1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {user?.fullName || "Team Lead"}
              </span>
            </div>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "3px 10px 3px 7px", borderRadius: 20,
              background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
              fontSize: 12, fontWeight: 600, color: "#818CF8",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366F1", boxShadow: "0 0 6px #6366F1" }} />
              Team Lead Panel
            </span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#F1F5F9", margin: 0, letterSpacing: "-0.01em" }}>
            Quick Actions
          </h2>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {quickActions.map((action) => (
            <ActionCard key={action.to} action={action} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamLeadDashboard;