import { useEffect, useState } from "react";
import { getFilteredTasks } from "../../services/dashboardService";

const statusConfig = {
  COMPLETED:   { dot: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", text: "#10B981",  label: "Completed"   },
  IN_PROGRESS: { dot: "#6366F1", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.3)",  text: "#818CF8",  label: "In Progress" },
  PENDING:     { dot: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", text: "#F59E0B",  label: "Pending"     },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { dot: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", text: "#94A3B8", label: status };
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
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${from}, ${to})`, fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.04em", flexShrink: 0, boxShadow: "0 0 0 2px rgba(99,102,241,0.18)" }}>
      {initials || "?"}
    </span>
  );
}

const SelfAssignedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data =
        await getFilteredTasks("self");

      setTasks(data.tasks || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 14, fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ width: 36, height: 36, border: "2px solid rgba(99,102,241,0.2)", borderTopColor: "#6366F1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <span style={{ color: "#64748B", fontSize: 14 }}>Loading tasks…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily:
          "'Inter', system-ui, sans-serif",
        color: "#F1F5F9",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.08))", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
              ✦
            </span>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                background: "linear-gradient(135deg, #F1F5F9 60%, #94A3B8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Self Assigned Tasks
            </h1>
          </div>
          <p style={{ color: "#64748B", fontSize: 13.5, margin: 0 }}>
            Tasks created and assigned by employees themselves.
          </p>
        </div>

        {tasks.length > 0 && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 24, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.22)", fontSize: 13, fontWeight: 600, color: "#818CF8" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366F1", boxShadow: "0 0 8px #6366F1" }} />
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </div>
        )}
      </div>

      {/* Table card */}
      <div
        style={{
          background: "#111827",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          position: "relative",
        }}
      >
        {/* Top accent line */}
        <div style={{ height: 3, background: "linear-gradient(90deg, #6366F1 0%, #8B5CF6 60%, transparent 100%)", position: "absolute", top: 0, left: 0, right: 0 }} />

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 14,
          }}
        >
          <thead>
            <tr style={{ background: "#0D1421", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Task", "Employee", "Status"].map((col, i) => (
                <th
                  key={col}
                  style={{
                    padding: i === 0 ? "13px 20px 13px 24px" : "13px 20px",
                    textAlign: "left",
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#64748B",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: "56px 24px", textAlign: "center" }}>
                  <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✦</span>
                    <div style={{ color: "#E2E8F0", fontWeight: 600, marginBottom: 4 }}>No self-assigned tasks</div>
                    <div style={{ color: "#64748B", fontSize: 13 }}>Tasks employees create for themselves will appear here.</div>
                  </div>
                </td>
              </tr>
            ) : (
              tasks.map((task, idx) => {
                const isHovered = hoveredRow === task._id;
                const isOdd = idx % 2 !== 0;
                return (
                  <tr
                    key={task._id}
                    onMouseEnter={() => setHoveredRow(task._id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      background: isHovered ? "rgba(99,102,241,0.07)" : isOdd ? "rgba(255,255,255,0.018)" : "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      transition: "background 0.15s ease",
                    }}
                  >
                    {/* Task */}
                    <td style={{ padding: "14px 20px 14px 24px" }}>
                      <div style={{ fontWeight: 500, color: "#E2E8F0", marginBottom: 2 }}>
                        {task.title}
                      </div>
                      {task._id && (
                        <div style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 11, color: "#475569", letterSpacing: "0.04em" }}>
                          #{task._id.slice(-6).toUpperCase()}
                        </div>
                      )}
                    </td>

                    {/* Employee */}
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={task.assignedTo?.fullName || ""} />
                        <span style={{ color: "#CBD5E1", fontWeight: 500 }}>
                          {task.assignedTo?.fullName || (
                            <span style={{ color: "#475569", fontStyle: "italic" }}>Unassigned</span>
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "14px 20px" }}>
                      <StatusBadge status={task.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SelfAssignedTasks;