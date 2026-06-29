import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyReports, submitReport } from "../../services/reportService";
import { getMyTasks } from "../../services/taskService";

const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
  color: "#E2E8F0", fontSize: 14, outline: "none", boxSizing: "border-box",
  fontFamily: "'Inter', system-ui, sans-serif", transition: "border-color 0.15s, box-shadow 0.15s",
};

const focusHandlers = {
  onFocus: (e) => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; },
  onBlur:  (e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; },
};

function FieldLabel({ children }) {
  return (
    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>
      {children}
    </label>
  );
}

function getAvatarColor(name = "") {
  const colors = [["#6366F1","#4F46E5"],["#8B5CF6","#7C3AED"],["#EC4899","#DB2777"],["#F59E0B","#D97706"],["#10B981","#059669"],["#3B82F6","#2563EB"]];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function TaskInitial({ title = "" }) {
  const letter = title.trim()[0]?.toUpperCase() || "T";
  const [from, to] = getAvatarColor(title);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${from}, ${to})`, fontSize: 15, fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: `0 0 0 2px rgba(99,102,241,0.15)` }}>
      {letter}
    </span>
  );
}

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ task: "", workDescription: "" });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const reportData = await getMyReports();
      const taskData = await getMyTasks();

      // Get task IDs already reported
      const reportedTaskIds = reportData.map(
        (report) => report.task?._id
      );

      // Only completed tasks that don't have a report yet
      const availableTasks = taskData.filter(
        (task) =>
          task.status === "COMPLETED" &&
          !reportedTaskIds.includes(task._id)
      );

      setReports(reportData);
      setTasks(availableTasks);

    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.task) return toast.error("Please select a task");
    setSubmitting(true);
    try {
      await submitReport(formData);
      toast.success("Report Submitted");
      setFormData({ task: "", workDescription: "" });
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 14, fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ width: 36, height: 36, border: "2px solid rgba(99,102,241,0.2)", borderTopColor: "#6366F1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <span style={{ color: "#64748B", fontSize: 14 }}>Loading…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#E2E8F0" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.08))", border: "1px solid rgba(245,158,11,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
            📋
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 700, background: "linear-gradient(135deg, #F1F5F9 60%, #94A3B8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, letterSpacing: "-0.02em" }}>
            My Reports
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <p style={{ color: "#64748B", fontSize: 13.5, margin: 0 }}>Submit work reports for completed tasks and review past submissions.</p>
          {reports.length > 0 && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 13px", borderRadius: 24, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", fontSize: 12.5, fontWeight: 600, color: "#F59E0B" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#F59E0B", boxShadow: "0 0 7px #F59E0B" }} />
              {reports.length} {reports.length === 1 ? "report" : "reports"} submitted
            </div>
          )}
        </div>
      </div>

      {/* ── Submit form ── */}
      <div style={{ background: "#111827", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.35)", marginBottom: 28, position: "relative" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg, #F59E0B 0%, #6366F1 60%, transparent 100%)" }} />

        {/* Form header */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D1421", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>📋</span>
          <h2 style={{ fontSize: 14.5, fontWeight: 700, color: "#E2E8F0", margin: 0, letterSpacing: "-0.01em" }}>
            Submit New Report
            {tasks.length > 0 && (
              <span style={{ marginLeft: 10, fontSize: 12, fontWeight: 600, color: "#64748B" }}>
                {tasks.length} task{tasks.length !== 1 ? "s" : ""} available
              </span>
            )}
          </h2>
        </div>

        <div style={{ padding: "22px 24px" }}>
          {tasks.length === 0 ? (
            /* No tasks available state */
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 12, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>✓</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#CBD5E1", marginBottom: 3 }}>All tasks reported</div>
                <div style={{ fontSize: 13, color: "#475569" }}>Complete more tasks to submit additional reports.</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gap: 16 }}>

                {/* Task select */}
                <div>
                  <FieldLabel>Completed Task</FieldLabel>
                  <div style={{ position: "relative" }}>
                    <select
                      name="task"
                      value={formData.task}
                      onChange={handleChange}
                      style={{ ...inputStyle, appearance: "none", WebkitAppearance: "none", paddingRight: 36, cursor: "pointer" }}
                      {...focusHandlers}
                    >
                      <option value="" style={{ background: "#0D1421" }}>Select a completed task…</option>
                      {tasks.map((task) => (
                        <option key={task._id} value={task._id} style={{ background: "#0D1421" }}>{task.title}</option>
                      ))}
                    </select>
                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#475569", fontSize: 12 }}>▾</span>
                  </div>
                </div>

                {/* Work description */}
                <div>
                  <FieldLabel>Work Description</FieldLabel>
                  <textarea
                    name="workDescription"
                    placeholder="Describe what was completed, key decisions made, and anything worth noting…"
                    value={formData.workDescription}
                    onChange={handleChange}
                    rows={5}
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65, minHeight: 110 }}
                    {...focusHandlers}
                  />
                </div>

                {/* Commented-out fields preserved */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* <div>
                    <FieldLabel>Hours Worked</FieldLabel>
                    <input
                      type="number"
                      name="hoursWorked"
                      placeholder="0"
                      value={formData.hoursWorked}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div> */}
                  {/* <div>
                    <FieldLabel>Progress %</FieldLabel>
                    <input
                      type="number"
                      name="progressPercentage"
                      placeholder="0–100"
                      value={formData.progressPercentage}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div> */}
                </div>

                {/* Submit */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, paddingTop: 4 }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 26px", borderRadius: 10, background: submitting ? "rgba(245,158,11,0.35)" : "linear-gradient(135deg, #F59E0B, #D97706)", border: "none", color: submitting ? "#94A3B8" : "#0A0F1E", fontSize: 13.5, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", boxShadow: submitting ? "none" : "0 0 20px rgba(245,158,11,0.3)", letterSpacing: "0.01em", transition: "opacity 0.15s" }}
                    onMouseEnter={e => { if (!submitting) e.currentTarget.style.opacity = "0.85"; }}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    {submitting ? (
                      <>
                        <div style={{ width: 14, height: 14, border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#0A0F1E", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                        Submitting…
                      </>
                    ) : "Submit Report"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── Reports list ── */}
      {reports.length > 0 && (
        <div>
          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", margin: 0, letterSpacing: "-0.01em" }}>Past Reports</h2>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Responsive 2-col grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 440px), 1fr))", gap: 14 }}>
            {reports.map((report, idx) => (
              <div
                key={report._id}
                style={{ background: "#111827", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", position: "relative", transition: "transform 0.18s, box-shadow 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)"; }}
              >
                <div style={{ height: 3, background: "linear-gradient(90deg, #6366F1, #8B5CF6, transparent)" }} />
                <div style={{ padding: "18px 20px" }}>

                  {/* Report header */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                    <TaskInitial title={report.task?.title || ""} />
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: "0 0 3px 0", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {report.task?.title || "—"}
                      </h3>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 9px", borderRadius: 20, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: "0.04em" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 5px #10B981" }} />
                        Completed
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 12 }} />

                  {/* Work description */}
                  <p style={{ color: "#94A3B8", fontSize: 13.5, lineHeight: 1.65, margin: 0, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {report.workDescription}
                  </p>

                  {/* Stat pills — commented-out fields preserved */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                    {/* <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", fontSize: 12, fontWeight: 600, color: "#818CF8", fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
                      ⏱ {report.hoursWorked}h
                    </span> */}
                    {/* <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 12, fontWeight: 600, color: "#10B981", fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
                      {report.progressPercentage}%
                    </span> */}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default MyReports;