import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getEmployeeDashboard } from "../../services/dashboardService";

const statCards = [
  { key: "assignedTasks",    label: "Assigned Tasks",    icon: "⚡", from: "#6366F1", to: "#4F46E5", glow: "rgba(99,102,241,0.3)" },
  { key: "completedTasks",   label: "Completed Tasks",   icon: "✓",  from: "#10B981", to: "#059669", glow: "rgba(16,185,129,0.3)" },
  { key: "reportsSubmitted", label: "Reports Submitted", icon: "📋", from: "#F59E0B", to: "#D97706", glow: "rgba(245,158,11,0.3)" },
  { key: "attendanceDays",   label: "Attendance Days",   icon: "🕐", from: "#3B82F6", to: "#2563EB", glow: "rgba(59,130,246,0.3)" },
];

const quickActions = [
  { to: "/my-tasks",      label: "My Tasks",      icon: "⚡", desc: "View assigned tasks",        from: "#6366F1", to2: "#4F46E5" },
  { to: "/my-reports",    label: "My Reports",    icon: "📋", desc: "Submit work reports",        from: "#F59E0B", to2: "#D97706" },
  { to: "/my-attendance", label: "My Attendance", icon: "🕐", desc: "Check attendance records",   from: "#10B981", to2: "#059669" },
  { to: "/my-profile",    label: "My Profile",    icon: "👤", desc: "Manage profile settings",    from: "#8B5CF6", to2: "#7C3AED" },
];

const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const data = await getEmployeeDashboard();
      setStats(data);
    } catch (error) {
      toast.error("Failed to load dashboard");
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#E2E8F0" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #6366F1, #4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 0 24px rgba(99,102,241,0.4)", flexShrink: 0 }}>
            ✦
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #F1F5F9 50%, #94A3B8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, letterSpacing: "-0.025em" }}>
            Employee Dashboard
          </h1>
        </div>
        <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>
          Here's a snapshot of your work activity and quick access to your tools.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
        {statCards.map((card) => (
          <div
            key={card.key}
            style={{ background: "#111827", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", position: "relative", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)"; }}
          >
            <div style={{ height: 3, background: `linear-gradient(90deg, ${card.from}, ${card.to})` }} />
            <div style={{ padding: "18px 20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {card.label}
                </span>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${card.from}28, ${card.to}14)`, border: `1px solid ${card.from}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                  {card.icon}
                </span>
              </div>
              <div style={{ fontSize: 38, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.03em", lineHeight: 1 }}>
                {stats ? (stats[card.key] ?? 0) : (
                  <div style={{ width: 52, height: 38, borderRadius: 6, background: "rgba(255,255,255,0.06)", animation: "pulse 1.5s infinite" }} />
                )}
              </div>
            </div>
          </div>
        ))}
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
          {quickActions.map((action) => {
            const isHovered = hoveredAction === action.to;
            return (
              <Link
                key={action.to}
                to={action.to}
                onMouseEnter={() => setHoveredAction(action.to)}
                onMouseLeave={() => setHoveredAction(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "18px 20px",
                  borderRadius: 14,
                  background: isHovered ? "rgba(255,255,255,0.04)" : "#111827",
                  border: isHovered ? `1px solid ${action.from}44` : "1px solid rgba(255,255,255,0.06)",
                  textDecoration: "none",
                  boxShadow: isHovered ? `0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px ${action.from}22` : "0 2px 12px rgba(0,0,0,0.25)",
                  transition: "all 0.18s ease",
                  transform: isHovered ? "translateY(-2px)" : "none",
                }}
              >
                <span style={{ width: 42, height: 42, borderRadius: 11, background: `linear-gradient(135deg, ${action.from}28, ${action.to2}14)`, border: `1px solid ${action.from}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {action.icon}
                </span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isHovered ? "#F1F5F9" : "#CBD5E1", marginBottom: 3, letterSpacing: "-0.01em" }}>
                    {action.label}
                  </div>
                  <div style={{ fontSize: 12, color: "#475569" }}>
                    {action.desc}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
};

export default EmployeeDashboard;