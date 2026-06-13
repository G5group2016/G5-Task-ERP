import { useEffect, useState } from "react";
import { getCompanies, deleteCompany, updateCompany } from "../../services/companyService";
import CompanyForm from "./CompanyForm";
import toast from "react-hot-toast";

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

const focusHandlers = {
  onFocus: (e) => {
    e.target.style.borderColor = "#6366F1";
    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
  },
  onBlur: (e) => {
    e.target.style.borderColor = "#1E293B";
    e.target.style.boxShadow = "none";
  },
};

const fieldLabelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: "600",
  color: "#475569",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: "6px",
};

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [editingCompany,
    setEditingCompany] =
    useState(null);

  const [editLogo,
    setEditLogo] =
    useState(null);

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

  const handleEditCompany =
    (company) => {

      setEditingCompany(
        company
      );

    };

  const handleUpdateCompany =
    async () => {

      try {

        const formData =
          new FormData();

        formData.append(
          "name",
          editingCompany.name
        );

        formData.append(
          "code",
          editingCompany.code
        );

        formData.append(
          "email",
          editingCompany.email
        );

        formData.append(
          "phone",
          editingCompany.phone
        );

        formData.append(
          "address",
          editingCompany.address
        );

        if (editLogo) {

          formData.append(
            "logo",
            editLogo
          );

        }

        await updateCompany(
          editingCompany._id,
          formData
        );

        toast.success(
          "Company Updated"
        );

        setEditingCompany(
          null
        );

        fetchCompanies();

      } catch (error) {

        toast.error(
          error.response?.data?.message
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
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() =>
                            handleEditCompany(company)
                          }
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
                            color: "#fff",
                            border: "none",
                            padding: "7px 16px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "12.5px",
                            letterSpacing: "0.01em",
                            boxShadow: "0 0 16px rgba(99,102,241,0.25)",
                            transition: "opacity 0.15s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                        >
                          ✎ Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteCompany(
                              company._id
                            )
                          }
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                            color: "#fff",
                            border: "none",
                            padding: "7px 16px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "12.5px",
                            letterSpacing: "0.01em",
                            boxShadow: "0 0 16px rgba(239,68,68,0.25)",
                            transition: "opacity 0.15s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                        >
                          🗑 Delete
                        </button>
                      </div>
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


      {
        editingCompany && (

          <div
            style={{
              position: "fixed",
              inset: 0,
              background:
                "rgba(8,13,26,0.85)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "24px",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >

            <div
              style={{
                background:
                  "#111827",
                borderRadius: "12px",
                border: "1px solid #1E293B",
                width: "500px",
                maxWidth: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              }}
            >

              {/* Modal header */}
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
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#E2E8F0", letterSpacing: "-0.01em" }}>
                  Edit Company
                </h3>
              </div>

              {/* Modal body */}
              <div style={{ padding: "20px 24px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <label style={fieldLabelStyle}>Company Name</label>
                    <input
                      value={editingCompany.name}
                      onChange={(e) =>
                        setEditingCompany({
                          ...editingCompany,
                          name: e.target.value
                        })
                      }
                      style={inputStyle}
                      {...focusHandlers}
                    />
                  </div>

                  <div>
                    <label style={fieldLabelStyle}>Company Code</label>
                    <input
                      value={editingCompany.code}
                      onChange={(e) =>
                        setEditingCompany({
                          ...editingCompany,
                          code: e.target.value
                        })
                      }
                      style={inputStyle}
                      {...focusHandlers}
                    />
                  </div>

                  <div>
                    <label style={fieldLabelStyle}>Email Address</label>
                    <input
                      value={editingCompany.email}
                      onChange={(e) =>
                        setEditingCompany({
                          ...editingCompany,
                          email: e.target.value
                        })
                      }
                      style={inputStyle}
                      {...focusHandlers}
                    />
                  </div>

                  <div>
                    <label style={fieldLabelStyle}>Phone Number</label>
                    <input
                      value={editingCompany.phone}
                      onChange={(e) =>
                        setEditingCompany({
                          ...editingCompany,
                          phone: e.target.value
                        })
                      }
                      style={inputStyle}
                      {...focusHandlers}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label style={fieldLabelStyle}>Address</label>
                  <textarea
                    value={editingCompany.address}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        address: e.target.value
                      })
                    }
                    rows={3}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      minHeight: "80px",
                    }}
                    {...focusHandlers}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={fieldLabelStyle}>Company Logo</label>

                  <label
                    htmlFor="edit-company-logo-upload"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "#0D1421",
                      border: "1px solid #1E293B",
                      cursor: "pointer",
                      position: "relative",
                      transition: "border-color 0.18s, box-shadow 0.18s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#6366F1";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#1E293B";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 14px",
                        borderRadius: "6px",
                        background: "rgba(99,102,241,0.15)",
                        border: "1px solid rgba(99,102,241,0.25)",
                        color: "#A5B4FC",
                        fontSize: "12.5px",
                        fontWeight: "600",
                        letterSpacing: "0.02em",
                        flexShrink: 0,
                      }}
                    >
                      📁 Choose File
                    </span>
                    <span
                      style={{
                        fontSize: "13.5px",
                        color: editLogo ? "#E2E8F0" : "#475569",
                        fontStyle: editLogo ? "normal" : "italic",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {editLogo ? editLogo.name : "No file selected"}
                    </span>
                    <input
                      id="edit-company-logo-upload"
                      type="file"
                      onChange={(e) =>
                        setEditLogo(
                          e.target.files[0]
                        )
                      }
                      style={{
                        position: "absolute",
                        width: "1px",
                        height: "1px",
                        opacity: 0,
                        pointerEvents: "none",
                      }}
                    />
                  </label>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() =>
                      setEditingCompany(
                        null
                      )
                    }
                    style={{
                      padding: "10px 22px",
                      borderRadius: "8px",
                      background: "transparent",
                      border: "1px solid #1E293B",
                      color: "#94A3B8",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      letterSpacing: "0.01em",
                      transition: "all 0.18s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#334155";
                      e.currentTarget.style.color = "#E2E8F0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#1E293B";
                      e.currentTarget.style.color = "#94A3B8";
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={
                      handleUpdateCompany
                    }
                    style={{
                      padding: "10px 24px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
                      border: "none",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                      transition: "all 0.18s ease",
                      letterSpacing: "0.01em",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.35)"; e.currentTarget.style.transform = "none"; }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

          </div>

        )}
    </div>
  );
};

export default CompanyList;