import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyTasks, updateTaskStatus } from "../../services/taskService";

const priorityConfig = {
  HIGH:   { bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)",   text: "#F87171", label: "High"   },
  MEDIUM: { bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)",  text: "#F59E0B", label: "Medium" },
  LOW:    { bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)",  text: "#10B981", label: "Low"    },
  URGENT: { bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)",   text: "#EF4444", label: "Urgent" },
};

const statusConfig = {
  COMPLETED:   { dot: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", text: "#10B981", label: "Completed",   progress: "100%", bar: "#10B981" },
  IN_PROGRESS: { dot: "#6366F1", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.3)",  text: "#818CF8", label: "In Progress", progress: "60%",  bar: "#6366F1" },
  PENDING:     { dot: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", text: "#F59E0B", label: "Pending",     progress: "20%",  bar: "#F59E0B" },
};

function Badge({ cfg, children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px 3px 7px", borderRadius: 20, background: cfg.bg, border: `1px solid ${cfg.border}`, fontSize: 12, fontWeight: 600, color: cfg.text, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot || cfg.text, boxShadow: `0 0 6px ${cfg.dot || cfg.text}`, flexShrink: 0 }} />
      {children}
    </span>
  );
}

/* ── Summary strip at the top ── */
function SummaryStrip({ tasks }) {
  const total       = tasks.length;
  const pending     = tasks.filter(t => t.status === "PENDING").length;
  const inProgress  = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const completed   = tasks.filter(t => t.status === "COMPLETED").length;

  const pills = [
    { label: "Total",       value: total,      color: "#818CF8", glow: "#6366F1", bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.22)" },
    { label: "Pending",     value: pending,    color: "#F59E0B", glow: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)"  },
    { label: "In Progress", value: inProgress, color: "#818CF8", glow: "#6366F1", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.22)" },
    { label: "Completed",   value: completed,  color: "#10B981", glow: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)"  },
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
      {pills.map(p => (
        <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 24, background: p.bg, border: `1px solid ${p.border}` }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: p.glow, boxShadow: `0 0 7px ${p.glow}`, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.value}</span>
          <span style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>{p.label}</span>
        </div>
      ))}
    </div>
  );
}

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      const data = await getMyTasks();
      setTasks(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      toast.success("Task Updated Successfully");
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
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
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#E2E8F0" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.08))", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
              ✦
            </span>
            <h1 style={{ fontSize: 26, fontWeight: 700, background: "linear-gradient(135deg, #F1F5F9 60%, #94A3B8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, letterSpacing: "-0.02em" }}>
              My Tasks
            </h1>
          </div>
          <p style={{ color: "#64748B", fontSize: 13.5, margin: 0 }}>Track and update your assigned tasks.</p>
        </div>
      </div>

      {/* ── Summary strip ── */}
      {tasks.length > 0 && <SummaryStrip tasks={tasks} />}

      {/* ── Empty state ── */}
      {tasks.length === 0 ? (
        <div style={{ background: "#111827", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", padding: "60px 24px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}>
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <span style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✦</span>
            <div style={{ color: "#E2E8F0", fontWeight: 600, marginBottom: 4 }}>No tasks assigned</div>
            <div style={{ color: "#64748B", fontSize: 13 }}>Tasks assigned to you will appear here.</div>
          </div>
        </div>
      ) : (
        /* ── Responsive 2-col grid on wide screens, 1-col on narrow ── */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 480px), 1fr))", gap: 16 }}>
          {tasks.map((task) => {
            const sCfg = statusConfig[task.status] || statusConfig.PENDING;
            const pCfg = priorityConfig[task.priority] || priorityConfig.MEDIUM;
            return (
              <div
                key={task._id}
                style={{ background: "#111827", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", position: "relative", display: "flex", flexDirection: "column", transition: "transform 0.18s, box-shadow 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)"; }}
              >
                {/* Top accent */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${sCfg.bar} 0%, #6366F1 60%, transparent 100%)`, flexShrink: 0 }} />

                <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>

                  {/* Title + self-assigned badge row */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", margin: 0, letterSpacing: "-0.01em", lineHeight: 1.35 }}>
                      {task.title}
                    </h2>
                    {task.isSelfAssigned && (
                      <span style={{ flexShrink: 0, background: "rgba(139,92,246,0.15)", color: "#A78BFA", border: "1px solid rgba(139,92,246,0.3)", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                        Self Assigned
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p style={{ color: "#94A3B8", fontSize: 13.5, margin: "0 0 14px 0", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {task.description}
                  </p>

                  {/* Badges */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
                    <Badge cfg={pCfg}>Priority: {pCfg.label || task.priority}</Badge>
                    <Badge cfg={sCfg}>{sCfg.label || task.status}</Badge>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase" }}>Progress</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: sCfg.text }}>{sCfg.progress}</span>
                    </div>
                    <div style={{ width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 5, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 99, width: sCfg.progress, background: `linear-gradient(90deg, ${sCfg.bar}, ${sCfg.bar}99)`, boxShadow: `0 0 8px ${sCfg.bar}66`, transition: "width 0.6s ease" }} />
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 14 }} />

                  {/* Meta grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px", fontSize: 12.5, color: "#64748B", marginBottom: 16 }}>
                    <span>📅 <span style={{ color: "#94A3B8", fontWeight: 500 }}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</span></span>
                    {task.completionDate && (
                      <span>✅ <span style={{ color: "#10B981", fontWeight: 600 }}>{new Date(task.completionDate).toLocaleDateString()}</span></span>
                    )}
                    {task.company && (
                      <span>🏢 <span style={{ color: "#94A3B8", fontWeight: 500 }}>{task.company?.name}</span></span>
                    )}
                    {task.assignedBy && (
                      <span>👤 <span style={{ color: "#94A3B8", fontWeight: 500 }}>{task.assignedBy?.fullName}</span></span>
                    )}
                  </div>

                  {/* Actions — pushed to bottom */}
                  {(task.status === "PENDING" || task.status === "IN_PROGRESS") && (
                    <div style={{ marginTop: "auto", display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {task.status === "PENDING" && (
                        <button
                          onClick={() => handleStatusUpdate(task._id, "IN_PROGRESS")}
                          style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 20px", borderRadius: 10, background: "linear-gradient(135deg, #6366F1, #4F46E5)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 0 20px rgba(99,102,241,0.3)", letterSpacing: "0.01em", transition: "opacity 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                        >
                          ▶ Start Task
                        </button>
                      )}
                      {task.status === "IN_PROGRESS" && (
                        <button
                          onClick={() => handleStatusUpdate(task._id, "COMPLETED")}
                          style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 20px", borderRadius: 10, background: "linear-gradient(135deg, #10B981, #059669)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 0 20px rgba(16,185,129,0.3)", letterSpacing: "0.01em", transition: "opacity 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                        >
                          ✓ Complete Task
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTasks;