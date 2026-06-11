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

function FieldLabel({ children }) {
  return (
    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>
      {children}
    </label>
  );
}

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ task: "", workDescription: "", hoursWorked: "", progressPercentage: "" });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const reportData = await getMyReports();
      const taskData = await getMyTasks();
      const completedTasks = taskData.filter((task) => task.status === "COMPLETED");
      setReports(reportData);
      setTasks(completedTasks);
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
      setFormData({ task: "", workDescription: "", hoursWorked: "", progressPercentage: "" });
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
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.08))", border: "1px solid rgba(245,158,11,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
            📋
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 700, background: "linear-gradient(135deg, #F1F5F9 60%, #94A3B8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, letterSpacing: "-0.02em" }}>
            My Reports
          </h1>
        </div>
        <p style={{ color: "#64748B", fontSize: 13.5, margin: 0 }}>Submit work reports for completed tasks and review past submissions.</p>
      </div>

      {/* Submit form card */}
      <div style={{ background: "#111827", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.35)", marginBottom: 28, position: "relative" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg, #F59E0B 0%, #6366F1 60%, transparent 100%)" }} />
        <div style={{ padding: "24px 28px" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: "0 0 20px 0", letterSpacing: "-0.01em" }}>Submit Report</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <FieldLabel>Completed Task</FieldLabel>
                <select
                  name="task"
                  value={formData.task}
                  onChange={handleChange}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                >
                  <option value="" style={{ background: "#1E293B" }}>Select a completed task…</option>
                  {tasks.map((task) => (
                    <option key={task._id} value={task._id} style={{ background: "#1E293B" }}>{task.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel>Work Description</FieldLabel>
                <textarea
                  name="workDescription"
                  placeholder="Describe the work completed…"
                  value={formData.workDescription}
                  onChange={handleChange}
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                  onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
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
                </div>
                <div>
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
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 10, background: submitting ? "rgba(245,158,11,0.4)" : "linear-gradient(135deg, #F59E0B, #D97706)", border: "none", color: submitting ? "#94A3B8" : "#0A0F1E", fontSize: 13.5, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", boxShadow: submitting ? "none" : "0 0 20px rgba(245,158,11,0.3)", letterSpacing: "0.01em", transition: "opacity 0.15s" }}
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
        </div>
      </div>

      {/* Reports list */}
      {reports.length > 0 && (
        <div style={{ display: "grid", gap: 16 }}>
          {reports.map((report) => (
            <div key={report._id} style={{ background: "#111827", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", position: "relative" }}>
              <div style={{ height: 3, background: "linear-gradient(90deg, #6366F1, #8B5CF6, transparent)" }} />
              <div style={{ padding: "20px 24px" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", margin: "0 0 10px 0" }}>{report.task?.title}</h2>
                <p style={{ color: "#94A3B8", fontSize: 13.5, lineHeight: 1.65, margin: "0 0 16px 0" }}>{report.workDescription}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", fontSize: 12, fontWeight: 600, color: "#818CF8", fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
                    ⏱ {report.hoursWorked}h
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 12, fontWeight: 600, color: "#10B981", fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
                    {report.progressPercentage}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default MyReports;