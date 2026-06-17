import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCompanyAdminDashboard } from "../../services/dashboardService";
import toast from "react-hot-toast";
import { getLatestTasks } from "../../services/taskService";
import { useNavigate } from "react-router-dom";

const priorityConfig = {
  URGENT: { dot: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", text: "#F87171", label: "Urgent" },
  HIGH: { dot: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", text: "#F59E0B", label: "High" },
  MEDIUM: { dot: "#3B82F6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)", text: "#60A5FA", label: "Medium" },
  LOW: { dot: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", text: "#10B981", label: "Low" },
};

const taskStatusConfig = {
  COMPLETED: { dot: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", text: "#10B981", label: "Completed" },
  IN_PROGRESS: { dot: "#6366F1", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.3)", text: "#818CF8", label: "In Progress" },
  PENDING: { dot: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", text: "#F59E0B", label: "Pending" },
};

function DotBadge({ config, value }) {
  const cfg = config[value] || { dot: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", text: "#94A3B8", label: value };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px 3px 7px", borderRadius: 20, background: cfg.bg, border: `1px solid ${cfg.border}`, fontSize: 12, fontWeight: 600, color: cfg.text, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}`, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

function getAvatarColor(name = "") {
  const colors = [["#6366F1", "#4F46E5"], ["#8B5CF6", "#7C3AED"], ["#EC4899", "#DB2777"], ["#F59E0B", "#D97706"], ["#10B981", "#059669"], ["#3B82F6", "#2563EB"], ["#EF4444", "#DC2626"], ["#14B8A6", "#0D9488"]];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function Avatar({ name = "" }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const [from, to] = getAvatarColor(name);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${from}, ${to})`, fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.04em", flexShrink: 0, boxShadow: "0 0 0 2px rgba(99,102,241,0.18)" }}>
      {initials || "?"}
    </span>
  );
}

const statCards = [
  { key: "totalEmployees", label: "Employees", route: "/employees", icon: "👥", from: "#6366F1", to: "#4F46E5", glow: "rgba(99,102,241,0.3)" },
  {
    key: "selfAssignedTasks",
    label: "Self Tasks",
    route: "/company-self-tasks",
    icon: "🚀",
    from: "#8B5CF6",
    to: "#7C3AED",
    glow: "rgba(139,92,246,0.3)"
  },
  { key: "pendingTasks", label: "Pending Tasks", route: "/pending-tasks", icon: "⏳", from: "#EF4444", to: "#DC2626", glow: "rgba(239,68,68,0.3)" },
  //   { key: "pendingTasks", label: "Pending Tasks", icon: "⏳", from: "#EF4444", to: "#DC2626", glow: "rgba(239,68,68,0.3)" },
  { key: "completedTasks", label: "Completed", route: "/completed-tasks", icon: "✓", from: "#10B981", to: "#059669", glow: "rgba(16,185,129,0.3)" },
  { key: "reportsSubmitted", label: "Reports", route: "/reports", icon: "📋", from: "#8B5CF6", to: "#7C3AED", glow: "rgba(139,92,246,0.3)" },
  { key: "attendanceToday", label: "Attendance Today", route: "/attendance", icon: "🕐", from: "#3B82F6", to: "#2563EB", glow: "rgba(59,130,246,0.3)" },
];

const quickActions = [
  { to: "/employees", label: "Manage Employees", icon: "👥", desc: "View and manage staff", from: "#6366F1", to2: "#4F46E5" },
  { to: "/tasks", label: "Manage Tasks", icon: "⚡", desc: "Assign and track tasks", from: "#F59E0B", to2: "#D97706" },
  { to: "/reports", label: "Reports", icon: "📋", desc: "Review submitted reports", from: "#8B5CF6", to2: "#7C3AED" },
  { to: "/attendance", label: "Attendance", icon: "🕐", desc: "Monitor team attendance", from: "#10B981", to2: "#059669" },
  { to: "/my-tasks", label: "My Tasks", icon: "✦", desc: "Your assigned tasks", from: "#3B82F6", to2: "#2563EB" },
  { to: "/my-reports", label: "My Reports", icon: "📄", desc: "Your submitted reports", from: "#EC4899", to2: "#DB2777" },
  { to: "/my-attendance", label: "My Attendance", icon: "📅", desc: "Your check-in history", from: "#14B8A6", to2: "#0D9488" },
  { to: "/my-profile", label: "My Profile", icon: "👤", desc: "Account & personal info", from: "#F97316", to2: "#EA580C" },
];

const CompanyAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null);
  const [latestTasks, setLatestTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { loadLatestTasks(); }, []);

  const loadLatestTasks = async () => {
    try {
      const data = await getLatestTasks();
      setLatestTasks(data.tasks);
    } catch (error) {
      console.log(error);
    }
  };

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
            onClick={() => navigate(card.route)}
            style={{
              cursor: "pointer",
              background: "#111827",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              position: "relative",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(0,0,0,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(0,0,0,0.3)";
            }}
          >
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
      <div style={{ marginBottom: 32 }}>
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
                  padding: "16px 18px", borderRadius: 14, textDecoration: "none",
                  background: isHovered ? "rgba(255,255,255,0.04)" : "#111827",
                  border: isHovered ? `1px solid ${action.from}44` : "1px solid rgba(255,255,255,0.06)",
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

      {/* Latest Tasks */}
      <div style={{ background: "#111827", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: "20px", boxShadow: "0 4px 24px rgba(0,0,0,0.35)", position: "relative" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg, #6366F1 0%, #8B5CF6 60%, transparent 100%)" }} />
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D1421", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>⚡</span>
            <h3 style={{ margin: 0, color: "#F1F5F9", fontSize: "15px", fontWeight: "700", letterSpacing: "-0.01em" }}>Latest Assigned Tasks</h3>
          </div>
          {latestTasks.length > 0 && (
            <span style={{ fontSize: 12, fontWeight: 600, color: "#64748B" }}>{latestTasks.length} tasks</span>
          )}
        </div>

        {latestTasks.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <span style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>⚡</span>
              <div style={{ color: "#64748B", fontSize: 13 }}>No tasks found</div>
            </div>
          </div>
        ) : (
          latestTasks.map((task, idx) => (
            <div
              key={task._id}
              style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", background: idx % 2 !== 0 ? "rgba(255,255,255,0.018)" : "transparent", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.07)"}
              onMouseLeave={e => e.currentTarget.style.background = idx % 2 !== 0 ? "rgba(255,255,255,0.018)" : "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={task.assignedTo?.fullName || ""} />
                <div>
                  <div style={{ color: "#E2E8F0", fontWeight: "600", fontSize: 14, marginBottom: "3px" }}>{task.title}</div>
                  <div style={{ color: "#64748B", fontSize: "12px" }}>
                    <span style={{ color: "#94A3B8" }}>{task.assignedTo?.fullName}</span>
                    {task.dueDate && (
                      <span> · Due <span style={{ color: "#475569" }}>{new Date(task.dueDate).toLocaleDateString()}</span></span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <DotBadge config={priorityConfig} value={task.priority} />
                <DotBadge config={taskStatusConfig} value={task.status} />
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
};

export default CompanyAdminDashboard;