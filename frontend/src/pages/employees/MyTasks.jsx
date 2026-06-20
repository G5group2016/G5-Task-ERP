import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyTasks, updateTaskStatus } from "../../services/taskService";

const priorityConfig = {
  HIGH: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", text: "#F87171", label: "High" },
  MEDIUM: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", text: "#F59E0B", label: "Medium" },
  LOW: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", text: "#10B981", label: "Low" },
  URGENT: {
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.25)",
    text: "#EF4444",
    label: "Urgent"
  }
};

const statusConfig = {
  COMPLETED: { dot: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", text: "#10B981", label: "Completed", progress: "100%", bar: "#10B981" },
  IN_PROGRESS: { dot: "#6366F1", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.3)", text: "#818CF8", label: "In Progress", progress: "60%", bar: "#6366F1" },
  PENDING: { dot: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", text: "#F59E0B", label: "Pending", progress: "20%", bar: "#F59E0B" },
};

function Badge({ cfg, children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 10px 3px 7px", borderRadius: 20,
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      fontSize: 12, fontWeight: 600, color: cfg.text, letterSpacing: "0.03em",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot || cfg.text, boxShadow: `0 0 6px ${cfg.dot || cfg.text}`, flexShrink: 0 }} />
      {children}
    </span>
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
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
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
        {tasks.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 24, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.22)", fontSize: 13, fontWeight: 600, color: "#818CF8" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366F1", boxShadow: "0 0 8px #6366F1" }} />
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </div>
        )}
      </div>

      {tasks.length === 0 ? (
        <div style={{ background: "#111827", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", padding: "60px 24px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}>
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <span style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✦</span>
            <div style={{ color: "#E2E8F0", fontWeight: 600, marginBottom: 4 }}>No tasks assigned</div>
            <div style={{ color: "#64748B", fontSize: 13 }}>Tasks assigned to you will appear here.</div>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {tasks.map((task) => {
            const sCfg = statusConfig[task.status] || statusConfig.PENDING;
            const pCfg = priorityConfig[task.priority] || priorityConfig.MEDIUM;
            return (
              <div key={task._id} style={{ background: "#111827", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", position: "relative", transition: "border-color 0.2s" }}>
                {/* Top accent */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${sCfg.bar} 0%, #6366F1 60%, transparent 100%)` }} />

                <div style={{ padding: "20px 24px" }}>
                  {/* Title row */}
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                    <div>
                      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#F1F5F9", margin: "0 0 6px 0", letterSpacing: "-0.01em" }}>{task.title}</h2>
                      <p style={{ color: "#94A3B8", fontSize: 13.5, margin: 0, lineHeight: 1.6 }}>{task.description}</p>
                    </div>
                  </div>
                  {task.isSelfAssigned && (

                    <span
                      style={{
                        background:
                          "rgba(139,92,246,.15)",
                        color:
                          "#A78BFA",
                        padding:
                          "4px 10px",
                        borderRadius:
                          "20px",
                        fontSize:
                          "12px",
                        fontWeight:
                          "600"
                      }}
                    >
                      Self Assigned
                    </span>

                  )}

                  {/* Badges */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                    <Badge cfg={pCfg}>Priority: {pCfg.label || task.priority}</Badge>
                    <Badge cfg={sCfg}>{sCfg.label || task.status}</Badge>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginTop: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase" }}>Progress</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: sCfg.text }}>{sCfg.progress}</span>
                    </div>
                    <div style={{ width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 6, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 99, width: sCfg.progress, background: `linear-gradient(90deg, ${sCfg.bar}, ${sCfg.bar}99)`, boxShadow: `0 0 8px ${sCfg.bar}66`, transition: "width 0.6s ease" }} />
                    </div>
                  </div>

                  {/* Meta */}
                  <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: "6px 24px", fontSize: 13, color: "#64748B" }}>
                    <span>📅 Due: <span style={{ color: "#94A3B8", fontWeight: 500 }}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</span></span>
                    {task.completionDate && (
                      <span>
                        ✅ Completed:
                        <span
                          style={{
                            color: "#10B981",
                            fontWeight: 600,
                            marginLeft: "4px"
                          }}
                        >
                          {new Date(task.completionDate).toLocaleDateString()}
                        </span>
                      </span>
                    )}
                    {task.company && <span>🏢 <span style={{ color: "#94A3B8", fontWeight: 500 }}>{task.company?.name}</span></span>}
                    {task.assignedBy && <span>👤 Assigned by: <span style={{ color: "#94A3B8", fontWeight: 500 }}>{task.assignedBy?.fullName}</span></span>}
                  </div>

                  {/* Actions */}
                  {(task.status === "PENDING" || task.status === "IN_PROGRESS") && (
                    <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 10 }}>
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