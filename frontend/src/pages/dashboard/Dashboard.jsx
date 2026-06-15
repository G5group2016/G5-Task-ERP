import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../services/dashboardService";
import { getLatestTasks } from "../../services/taskService";

const priorityConfig = {
  URGENT: { dot: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", text: "#F87171", label: "Urgent" },
  HIGH:   { dot: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", text: "#F59E0B", label: "High" },
  MEDIUM: { dot: "#3B82F6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)", text: "#60A5FA", label: "Medium" },
  LOW:    { dot: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", text: "#10B981", label: "Low" },
};

const taskStatusConfig = {
  COMPLETED:   { dot: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", text: "#10B981", label: "Completed" },
  IN_PROGRESS: { dot: "#6366F1", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.3)",  text: "#818CF8", label: "In Progress" },
  PENDING:     { dot: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", text: "#F59E0B", label: "Pending" },
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
  const colors = [["#6366F1","#4F46E5"],["#8B5CF6","#7C3AED"],["#EC4899","#DB2777"],["#F59E0B","#D97706"],["#10B981","#059669"],["#3B82F6","#2563EB"],["#EF4444","#DC2626"],["#14B8A6","#0D9488"]];
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

const StatCard = ({ label, value, accent, icon, delta, onClick }) => (
  <div
    onClick={onClick}
    style={{ background: "#111827", borderRadius: "12px", border: "1px solid #1E293B", padding: "22px 24px", position: "relative", overflow: "hidden", transition: "border-color 0.2s, transform 0.18s", cursor: "pointer" }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accent}50`; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1E293B"; e.currentTarget.style.transform = "none"; }}
  >
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.7 }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.09em", textTransform: "uppercase", color: "#475569", margin: "0 0 12px" }}>{label}</p>
        <p style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: "800", color: "#F1F5F9", margin: 0, letterSpacing: "-0.04em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          {value ?? <span style={{ color: "#2D3748", fontSize: "28px" }}>—</span>}
        </p>
        {delta !== undefined && (
          <p style={{ fontSize: "12px", color: "#10B981", margin: "8px 0 0", fontWeight: "600" }}>{delta}</p>
        )}
      </div>
      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${accent}18`, border: `1px solid ${accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const [latestTasks, setLatestTasks] = useState([]);

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
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  const cards = [
    { label: "Total Companies",  value: stats?.totalCompanies,  accent: "#6366F1", icon: "🏢", path: "/companies" },
    { label: "Total Employees",  value: stats?.totalEmployees,  accent: "#10B981", icon: "👥", path: "/employees" },
    // { label: "Active Tasks",  value: stats?.activeTasks,  accent: "#F59E0B", icon: "⚡", path: "/tasks" },
    { label: "Completed Tasks",  value: stats?.completedTasks,  accent: "#3B82F6", icon: "✓", path: "/completed-tasks" },
    { label: "Pending Tasks",    value: stats?.pendingTasks,    accent: "#EF4444", icon: "⏳", path: "/pending-tasks" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#F1F5F9", padding: "0 16px" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.1em", color: "#6366F1", textTransform: "uppercase", marginBottom: "4px" }}>Overview</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 28px)", fontWeight: "700", color: "#F1F5F9", margin: 0, letterSpacing: "-0.03em" }}>Dashboard</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "20px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981", display: "inline-block" }} />
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#10B981" }}>All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        {cards.map((card) => (
          <StatCard key={card.label} {...card} onClick={() => navigate(card.path)} />
        ))}
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

      {/* Quick summary bar */}
      <div style={{ background: "#111827", borderRadius: "12px", border: "1px solid #1E293B", padding: "16px 24px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#6366F1", boxShadow: "0 0 8px #6366F1", flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>
          Last refreshed:{" "}
          <span style={{ color: "#94A3B8", fontWeight: "500" }}>
            {new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </span>
        </p>
        <button
          onClick={loadDashboard}
          style={{ marginLeft: "auto", padding: "5px 14px", borderRadius: "6px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#6366F1", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default Dashboard;