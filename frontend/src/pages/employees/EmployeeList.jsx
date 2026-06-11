import { useEffect, useState } from "react";
import { getEmployees } from "../../services/employeeService";
import EmployeeForm from "./EmployeeForm";

const roleConfig = {
  SUPER_ADMIN:   { color: "#6366F1", bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.25)",  label: "Super Admin"   },
  COMPANY_ADMIN: { color: "#10B981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)",  label: "Company Admin" },
  TEAM_LEAD:     { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)",  label: "Team Lead"     },
  EMPLOYEE:      { color: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)",  label: "Employee"      },
};

const RoleBadge = ({ role }) => {
  const cfg = roleConfig[role] || { color: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", label: role };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        letterSpacing: "0.03em",
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {cfg.label}
    </span>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "6px",
      padding: "20px",
      borderTop: "1px solid #1E293B",
      flexWrap: "wrap",
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          background: currentPage === 1 ? "rgba(100,100,100,0.1)" : "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.2)",
          color: currentPage === 1 ? "#475569" : "#6366F1",
          fontSize: "13px",
          fontWeight: "600",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          transition: "all 0.15s",
        }}
      >
        ← Prev
      </button>
      
      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            background: currentPage === page ? "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)" : "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            color: currentPage === page ? "#fff" : "#6366F1",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          background: currentPage === totalPages ? "rgba(100,100,100,0.1)" : "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.2)",
          color: currentPage === totalPages ? "#475569" : "#6366F1",
          fontSize: "13px",
          fontWeight: "600",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          transition: "all 0.15s",
        }}
      >
        Next →
      </button>
    </div>
  );
};

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => { loadEmployees(); }, []);

  const loadEmployees = async () => {
    const data = await getEmployees();
    setEmployees(data.employees);
    setCurrentPage(1);
  };

  // Get current employees for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of table
    document.querySelector('.table-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#F1F5F9", padding: "0 16px" }}>

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.1em", color: "#6366F1", textTransform: "uppercase", marginBottom: "4px" }}>
          People
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 28px)", fontWeight: "700", color: "#F1F5F9", margin: 0, letterSpacing: "-0.03em" }}>
            Employees
          </h1>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "5px 14px",
              borderRadius: "20px",
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
              fontSize: "13px",
              fontWeight: "600",
              color: "#10B981",
            }}
          >
            {employees.length} total
          </div>
        </div>
      </div>

      <EmployeeForm onSuccess={loadEmployees} />

      {/* Table */}
      <div
        className="table-container"
        style={{
          background: "#111827",
          borderRadius: "12px",
          border: "1px solid #1E293B",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
            <thead>
              <tr style={{ background: "#0D1421", borderBottom: "1px solid #1E293B" }}>
                {["Employee", "Email", "Role", "Company"].map((h) => (
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
              {currentEmployees.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "48px", textAlign: "center", color: "#475569", fontSize: "14px" }}>
                    No employees found
                  </td>
                </tr>
              ) : (
                currentEmployees.map((employee, i) => (
                  <tr
                    key={employee._id}
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
                            borderRadius: "50%",
                            background: `hsl(${(employee.fullName?.charCodeAt(0) || 0) * 53 % 360}, 55%, 28%)`,
                            border: `2px solid hsl(${(employee.fullName?.charCodeAt(0) || 0) * 53 % 360}, 55%, 42%)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "13px",
                            fontWeight: "700",
                            color: "#fff",
                            flexShrink: 0,
                          }}
                        >
                          {employee.fullName?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#E2E8F0" }}>
                            {employee.fullName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#64748B" }}>
                      {employee.email}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <RoleBadge role={employee.role} />
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#94A3B8" }}>
                      {employee.company?.name || <span style={{ color: "#374151" }}>—</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default EmployeeList;