import { useState } from "react";
import toast from "react-hot-toast";
import { createCompany } from "../../services/companyService";

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

const InputField = ({ name, placeholder, value, onChange, type = "text" }) => (
  <input
    name={name}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    style={inputStyle}
    onFocus={(e) => {
      e.target.style.borderColor = "#6366F1";
      e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
    }}
    onBlur={(e) => {
      e.target.style.borderColor = "#1E293B";
      e.target.style.boxShadow = "none";
    }}
  />
);

const CompanyForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCompany(formData);
      setFormData({ name: "", code: "", email: "", phone: "", address: "" });
      toast.success("Company Created");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "12px",
        border: "1px solid #1E293B",
        overflow: "hidden",
        marginBottom: "24px",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Form header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #1E293B",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "#0D1421",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "7px",
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
          }}
        >
          🏢
        </div>
        <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#E2E8F0", letterSpacing: "-0.01em" }}>
          Register New Company
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "20px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
              Company Name
            </label>
            <InputField name="name" placeholder="Acme Corporation" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
              Company Code
            </label>
            <InputField name="code" placeholder="ACME-001" value={formData.code} onChange={handleChange} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
              Email Address
            </label>
            <InputField name="email" type="email" placeholder="admin@acme.com" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
              Phone Number
            </label>
            <InputField name="phone" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
            Address
          </label>
          <textarea
            name="address"
            placeholder="Street address, City, State, ZIP"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            style={{
              ...inputStyle,
              resize: "vertical",
              minHeight: "80px",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#6366F1";
              e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#1E293B";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              background: loading ? "#374151" : "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
              border: "none",
              color: loading ? "#6B7280" : "#fff",
              fontSize: "14px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 14px rgba(99,102,241,0.35)",
              transition: "all 0.18s ease",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
            onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.35)"; e.currentTarget.style.transform = "none"; } }}
          >
            {loading ? "Saving..." : "Save Company"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;