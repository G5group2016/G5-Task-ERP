import { useEffect, useState } from "react";
import { getCompanies, deleteCompany } from "../../services/companyService";
import CompanyForm from "./CompanyForm";
import toast from "react-hot-toast";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => { fetchCompanies(); }, []);

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data.companies);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCompany = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to disable this company?"
      );

    if (!confirmDelete) return;

    try {

      await deleteCompany(id);

      toast.success(
        "Company Disabled"
      );

      fetchCompanies();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to disable company"
      );

    }
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#F1F5F9" }}>

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.1em", color: "#6366F1", textTransform: "uppercase", marginBottom: "4px" }}>
          Organization
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#F1F5F9", margin: 0, letterSpacing: "-0.03em" }}>
            Companies
          </h1>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "5px 14px",
              borderRadius: "20px",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              fontSize: "13px",
              fontWeight: "600",
              color: "#818CF8",
            }}
          >
            {companies.length} registered
          </div>
        </div>
      </div>

      <CompanyForm onSuccess={fetchCompanies} />

      {/* Table */}
      <div
        style={{
          background: "#111827",
          borderRadius: "12px",
          border: "1px solid #1E293B",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "520px" }}>
            <thead>
              <tr style={{ background: "#0D1421", borderBottom: "1px solid #1E293B" }}>
                {["Company", "Code", "Email", "Phone", "Action"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: "700",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#475569",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "48px", textAlign: "center", color: "#475569", fontSize: "14px" }}>
                    No companies registered yet
                  </td>
                </tr>
              ) : (
                companies.map((company, i) => (
                  <tr
                    key={company._id}
                    style={{
                      borderBottom: "1px solid #1A2233",
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)"; }}
                  >
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            background: `hsl(${(company.name?.charCodeAt(0) || 0) * 37 % 360}, 55%, 30%)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "13px",
                            fontWeight: "700",
                            color: "#fff",
                            flexShrink: 0,
                            border: `1px solid hsl(${(company.name?.charCodeAt(0) || 0) * 37 % 360}, 55%, 40%)`,
                          }}
                        >
                          {company.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#E2E8F0" }}>
                          {company.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#818CF8",
                          background: "rgba(99,102,241,0.1)",
                          border: "1px solid rgba(99,102,241,0.2)",
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {company.code}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "14px", color: "#94A3B8" }}>
                      {company.email}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "14px", color: "#94A3B8", fontVariantNumeric: "tabular-nums" }}>
                      {company.phone}
                    </td>

                    <td style={{ padding: "14px 20px" }}>
                      <button
                        onClick={() =>
                          handleDeleteCompany(
                            company._id
                          )
                        }
                        style={{
                          background: "#DC2626",
                          color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        Disable
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyList;