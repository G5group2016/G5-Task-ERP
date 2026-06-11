import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCompanyAdminDashboard } from "../../services/dashboardService";
import toast from "react-hot-toast";

const statCards = [
  { key: "totalEmployees",   label: "Employees",       icon: "👥", from: "#6366F1", to: "#4F46E5", glow: "rgba(99,102,241,0.3)" },
  { key: "activeTasks",      label: "Active Tasks",    icon: "⚡", from: "#F59E0B", to: "#D97706", glow: "rgba(245,158,11,0.3)" },
  { key: "completedTasks",   label: "Completed",       icon: "✓",  from: "#10B981", to: "#059669", glow: "rgba(16,185,129,0.3)" },
  { key: "reportsSubmitted", label: "Reports",         icon: "📋", from: "#8B5CF6", to: "#7C3AED", glow: "rgba(139,92,246,0.3)" },
  { key: "attendanceToday",  label: "Attendance Today",icon: "🕐", from: "#3B82F6", to: "#2563EB", glow: "rgba(59,130,246,0.3)" },
];

const quickActions = [
  { to: "/employees",     label: "Manage Employees", icon: "👥", desc: "View and manage staff",        from: "#6366F1", to2: "#4F46E5" },
  { to: "/tasks",         label: "Manage Tasks",     icon: "⚡", desc: "Assign and track tasks",       from: "#F59E0B", to2: "#D97706" },
  { to: "/reports",       label: "Reports",          icon: "📋", desc: "Review submitted reports",     from: "#8B5CF6", to2: "#7C3AED" },
  { to: "/attendance",    label: "Attendance",       icon: "🕐", desc: "Monitor team attendance",      from: "#10B981", to2: "#059669" },
  { to: "/my-tasks",      label: "My Tasks",         icon: "✦",  desc: "Your assigned tasks",          from: "#3B82F6", to2: "#2563EB" },
  { to: "/my-reports",    label: "My Reports",       icon: "📄", desc: "Your submitted reports",       from: "#EC4899", to2: "#DB2777" },
  { to: "/my-attendance", label: "My Attendance",    icon: "📅", desc: "Your check-in history",        from: "#14B8A6", to2: "#0D9488" },
  { to: "/my-profile",    label: "My Profile",       icon: "👤", desc: "Account & personal info",      from: "#F97316", to2: "#EA580C" },
];

const CompanyAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const data = await getCompanyAdminDashboard();
      setStats(data);
    } catch {
      toast.error("Failed to load dashboard");
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#E2E8F0" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #6366F1, #4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 0 24px rgba(99,102,241,0.4)" }}>
            🏢
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #F1F5F9 50%, #94A3B8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, letterSpacing: "-0.025em" }}>
            Company Dashboard
          </h1>
        </div>
        <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>Welcome back — here's an overview of your company's activity.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 40 }}>
        {statCards.map((card) => (
          <div
            key={card.key}
            style={{ background: "#111827", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", position: "relative", transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)"; }}
          >
            {/* Accent line */}
            <div style={{ height: 3, background: `linear-gradient(90deg, ${card.from}, ${card.to})` }} />
            <div style={{ padding: "18px 20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase" }}>{card.label}</span>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${card.from}22, ${card.to}11)`, border: `1px solid ${card.from}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{card.icon}</span>
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.03em", lineHeight: 1 }}>
                {stats ? (stats[card.key] ?? 0) : (
                  <div style={{ width: 48, height: 36, borderRadius: 6, background: "rgba(255,255,255,0.06)", animation: "pulse 1.5s infinite" }} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#F1F5F9", margin: 0, letterSpacing: "-0.01em" }}>Quick Actions</h2>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
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
                  padding: "16px 18px",
                  borderRadius: 14,
                  background: isHovered ? "rgba(255,255,255,0.04)" : "#111827",
                  border: isHovered ? `1px solid ${action.from}44` : "1px solid rgba(255,255,255,0.06)",
                  textDecoration: "none",
                  boxShadow: isHovered ? `0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px ${action.from}22` : "0 2px 12px rgba(0,0,0,0.25)",
                  transition: "all 0.18s ease",
                  transform: isHovered ? "translateY(-2px)" : "none",
                }}
              >
                <span style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${action.from}28, ${action.to2}14)`, border: `1px solid ${action.from}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>
                  {action.icon}
                </span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: isHovered ? "#F1F5F9" : "#CBD5E1", marginBottom: 2, letterSpacing: "-0.01em" }}>{action.label}</div>
                  <div style={{ fontSize: 11.5, color: "#475569" }}>{action.desc}</div>
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

export default CompanyAdminDashboard;