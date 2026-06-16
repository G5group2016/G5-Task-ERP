import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createEmployee } from "../../services/employeeService";
import { getCompanies } from "../../services/companyService";

const inputStyle = {
  padding: "10px 14px",
  borderRadius: "8px",
  background: "#0D1421",
  border: "1px solid #1E293B",
  color: "#F1F5F9",
  fontSize: "14px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
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

const focusStyle = (e) => {
  e.target.style.borderColor = "#6366F1";
  e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
};
const blurStyle = (e) => {
  e.target.style.borderColor = "#1E293B";
  e.target.style.boxShadow = "none";
};

const EmployeeForm = ({ onSuccess }) => {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", phone: "",
    designation: "", department: "", role: "EMPLOYEE", company: "",
  });

  useEffect(() => { loadCompanies(); }, []);

  const loadCompanies = async () => {
    const companyData = await getCompanies();
    setCompanies(companyData.companies);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "role" &&
        value === "OFFICE_MANAGER"
        ? { company: "" }
        : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEmployee(formData);
      toast.success("Employee Created Successfully");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to Create Employee");
    }
  };

  const fields = [
    { name: "fullName", label: "Full Name", placeholder: "John Doe" },
    { name: "email", label: "Email", placeholder: "john@company.com" },
    { name: "password", label: "Password", placeholder: "••••••••", type: "password" },
    { name: "phone", label: "Phone", placeholder: "+1 (555) 000-0000" },
    { name: "designation", label: "Designation", placeholder: "Software Engineer" },
    { name: "department", label: "Department", placeholder: "Engineering" },
  ];

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
        }}>👤</div>
        <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#E2E8F0", letterSpacing: "-0.01em" }}>
          Add New Employee
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "20px 24px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px", marginBottom: "12px",
        }}>
          {fields.map(({ name, label, placeholder, type = "text" }) => (
            <Field key={name} label={label}>
              <input
                name={name} type={type} placeholder={placeholder}
                onChange={handleChange} style={inputStyle}
                onFocus={focusStyle} onBlur={blurStyle}
              />
            </Field>
          ))}

          <Field label="Role">
            <select name="role" onChange={handleChange}
              style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}>
              <option value="EMPLOYEE">Employee</option>
              <option value="TEAM_LEAD">Team Lead</option>
              <option value="COMPANY_ADMIN">Head Of Department</option>
              <option value="OFFICE_MANAGER">
                Office Manager
              </option>
            </select>
          </Field>

          {formData.role !== "OFFICE_MANAGER" && (
            <Field label="Company">
              <select
                name="company"
                onChange={handleChange}
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              >
                <option value="">
                  Select Company
                </option>

                {companies.map((company) => (
                  <option
                    key={company._id}
                    value={company._id}
                  >
                    {company.name}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
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
            Save Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;