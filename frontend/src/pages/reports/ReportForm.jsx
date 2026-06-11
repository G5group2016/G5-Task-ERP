import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { submitReport } from "../../services/reportService";
import { getTasks } from "../../services/taskService";

const inputStyle = {
  padding: "10px 14px", borderRadius: "8px",
  background: "#0D1421", border: "1px solid #1E293B",
  color: "#F1F5F9", fontSize: "14px", outline: "none",
  width: "100%", boxSizing: "border-box",
  transition: "border-color 0.18s, box-shadow 0.18s",
  fontFamily: "'Inter', system-ui, sans-serif",
};

const Field = ({ label, children }) => (
  <div style={{ marginBottom: "12px" }}>
    <label style={{
      display: "block", fontSize: "11px", fontWeight: "700",
      color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px",
    }}>
      {label}
    </label>
    {children}
  </div>
);

const focusStyle = (e) => { e.target.style.borderColor = "#6366F1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; };
const blurStyle  = (e) => { e.target.style.borderColor = "#1E293B"; e.target.style.boxShadow = "none"; };

const ReportForm = ({ onSuccess }) => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    task: "", workDescription: "", hoursWorked: "", progressPercentage: "",
  });

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data.tasks);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitReport(formData);
      toast.success("Report Submitted");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div style={{
      background: "#111827", borderRadius: "12px",
      border: "1px solid #1E293B", overflow: "hidden",
      marginBottom: "24px", fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 24px", borderBottom: "1px solid #1E293B",
        display: "flex", alignItems: "center", gap: "10px", background: "#0D1421",
      }}>
        <div style={{
          width: "28px", height: "28px", borderRadius: "7px",
          background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
        }}>📋</div>
        <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#E2E8F0", letterSpacing: "-0.01em" }}>
          Submit Work Report
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "20px 24px" }}>
        <Field label="Task">
          <select name="task" onChange={handleChange}
            style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}>
            <option value="">Select Task</option>
            {tasks.map((task) => (
              <option key={task._id} value={task._id}>{task.title}</option>
            ))}
          </select>
        </Field>

        <Field label="Work Done">
          <textarea name="workDescription" placeholder="Describe what you worked on today..."
            onChange={handleChange} rows={3}
            style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
            onFocus={focusStyle} onBlur={blurStyle}
          />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <Field label="Hours Worked">
            <input type="number" name="hoursWorked" placeholder="e.g. 8"
              onChange={handleChange} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </Field>
          <Field label="Progress %">
            <input type="number" name="progressPercentage" placeholder="e.g. 75"
              min="0" max="100"
              onChange={handleChange} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </Field>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            style={{
              padding: "10px 24px", borderRadius: "8px",
              background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
              border: "none", color: "#fff", fontSize: "14px", fontWeight: "600",
              cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              transition: "all 0.18s ease", letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.35)"; e.currentTarget.style.transform = "none"; }}
          >
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;