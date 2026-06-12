import { useEffect, useState } from "react";
import { getCompanies, deleteCompany } from "../../services/companyService";
import CompanyForm from "./CompanyForm";
import toast from "react-hot-toast";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedLogo, setSelectedLogo] = useState(null);

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
        "Are you sure you want to delete this company?"
      );

    if (!confirmDelete) return;

    try {

      await deleteCompany(id);

      toast.success(
        "Company Deleted"
      );

      fetchCompanies();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to delete company"
      );

    }
  };

  const handleLogoClick = (logoUrl) => {
    setSelectedLogo(logoUrl);
  };

  const closeModal = () => {
    setSelectedLogo(null);
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
                  <td colSpan={5} style={{ padding: "48px", textAlign: "center", color: "#475569", fontSize: "14px" }}>
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
                        {company.logo ? (

                          <img
                            src={company.logo}
                            alt={company.name}
                            onClick={() => handleLogoClick(company.logo)}
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "8px",
                              objectFit: "cover",
                              border:
                                "1px solid #334155",
                              flexShrink: 0,
                              cursor: "pointer",
                              transition: "transform 0.2s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                          />

                        ) : (

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
                            }}
                          >
                            {company.name?.[0]?.toUpperCase()}
                          </div>

                        )}
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
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logo Modal */}
      {selectedLogo && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            cursor: "pointer",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
            }}
          >
            <img
              src={selectedLogo}
              alt="Company logo"
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            />
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "-40px",
                right: "-40px",
                background: "#1E293B",
                color: "#F1F5F9",
                border: "none",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#DC2626"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#1E293B"; }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyList;