import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createTask } from "../../services/taskService";
import { getEmployees } from "../../services/employeeService";
import { getCompanies } from "../../services/companyService";

const inputStyle = {
  padding: "10px 14px", borderRadius: "8px",
  background: "#0D1421", border: "1px solid #1E293B",
  color: "#F1F5F9", fontSize: "14px", outline: "none",
  width: "100%", boxSizing: "border-box",
  transition: "border-color 0.18s, box-shadow 0.18s",
  fontFamily: "'Inter', system-ui, sans-serif",
};

const Field = ({ label, children }) => (
  <div>
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

const priorityConfig = {
  LOW:    { color: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" },
  MEDIUM: { color: "#60A5FA", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.2)"  },
  HIGH:   { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)"  },
  URGENT: { color: "#EF4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.2)"   },
};

const TaskForm = ({ onSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    title: "", description: "", company: "",
    assignedTo: "", priority: "MEDIUM", dueDate: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const empData = await getEmployees();
      if (user?.role === "COMPANY_ADMIN") {
        setEmployees(empData.employees.filter((e) => e.role !== "COMPANY_ADMIN"));
      } else {
        setEmployees(empData.employees);
      }
      const companyData = await getCompanies();
      setCompanies(companyData.companies);
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.assignedTo) return toast.error("Please select an employee");
    try {
      const payload = { ...formData };
      if (user?.role === "COMPANY_ADMIN") payload.company = user.company;
      await createTask(payload);
      setFormData({ title: "", description: "", company: "", assignedTo: "", priority: "MEDIUM", dueDate: "" });
      toast.success("Task Assigned");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
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
        }}>⚡</div>
        <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#E2E8F0", letterSpacing: "-0.01em" }}>
          Create New Task
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "20px 24px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "12px", marginBottom: "12px",
        }}>
          <Field label="Task Title">
            <input name="title" placeholder="Fix login bug" value={formData.title}
              onChange={handleChange} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </Field>

          {user?.role === "SUPER_ADMIN" && (
            <Field label="Company">
              <select name="company" value={formData.company} onChange={handleChange}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}>
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Assign To">
            <select name="assignedTo" value={formData.assignedTo} onChange={handleChange}
              style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}>
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.fullName} — {emp.role}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Priority">
            <select name="priority" value={formData.priority} onChange={handleChange}
              style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}>
              {Object.keys(priorityConfig).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </Field>

          <Field label="Due Date">
            <input type="date" name="dueDate" value={formData.dueDate}
              onChange={handleChange} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </Field>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{
            display: "block", fontSize: "11px", fontWeight: "700",
            color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px",
          }}>
            Description
          </label>
          <textarea name="description" placeholder="Describe the task in detail..."
            value={formData.description} onChange={handleChange} rows={3}
            style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
            onFocus={focusStyle} onBlur={blurStyle}
          />
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
            Assign Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;