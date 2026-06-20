import { useEffect, useState } from "react";
import { getReports, downloadReportsExcel } from "../../services/reportService";
import ReportForm from "./ReportForm";

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

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
    const data = await getReports();
    setReports(data.reports);
    setCurrentPage(1);
  };

  const handleDownloadExcel =
    async () => {

      try {

        const response =
          await downloadReportsExcel();

        const url =
          window.URL.createObjectURL(
            new Blob([
              response.data
            ])
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.setAttribute(
          "download",
          "Reports.xlsx"
        );

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

      } catch (error) {

        console.log(error);

      }
    };

  // Get current reports for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = reports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reports.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    document.querySelector('.table-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#F1F5F9", padding: "0 16px" }}>

      {/* Header */}
      <div style={{
        marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid #1E293B",
        display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
      }}>
        <div>
          <p style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.1em", color: "#6366F1", textTransform: "uppercase", margin: "0 0 4px" }}>
            Reporting
          </p>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 28px)", fontWeight: "700", color: "#F1F5F9", margin: 0, letterSpacing: "-0.03em" }}>
            Work Reports
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
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
            {reports.length} submitted
          </div>

          {(
            user?.role === "SUPER_ADMIN" ||
            user?.role === "OFFICE_MANAGER" ||
            user?.role === "COMPANY_ADMIN"
          ) && (
              <button
                onClick={handleDownloadExcel}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "#10B981",
                  border: "none",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Download Excel
              </button>
            )}
        </div>
      </div>

      {(
        user?.role === "EMPLOYEE" ||
        user?.role === "TEAM_LEAD"
      ) && (
          <ReportForm
            onSuccess={loadReports}
          />
        )}

      {/* Table */}
      <div
        className="table-container"
        style={{
          background: "#111827", borderRadius: "12px",
          border: "1px solid #1E293B", overflow: "hidden",
        }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "400px" }}>
            <thead>
              <tr style={{ background: "#0D1421", borderBottom: "1px solid #1E293B" }}>
                {["Employee", "Task"].map((h) => (
                  <th key={h} style={{
                    padding: "12px 20px", textAlign: "left",
                    fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em",
                    textTransform: "uppercase", color: "#475569",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentReports.length === 0 ? (
                <tr>
                  <td colSpan={2} style={{ padding: "48px", textAlign: "center", color: "#475569", fontSize: "14px" }}>
                    No reports submitted yet
                  </td>
                </tr>
              ) : (
                currentReports.map((report, i) => (
                  <tr
                    key={report._id}
                    style={{
                      borderBottom: "1px solid #1A2233",
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)"; }}
                  >
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "50%",
                          background: `hsl(${(
                            report?.employee?.fullName ||
                            report?.employeeName ||
                            ""
                          ).charCodeAt(0) * 47 % 360
                            }, 55%, 35%)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "11px", fontWeight: "700", color: "#fff", flexShrink: 0,
                        }}>
                          {
                            (
                              report?.employee?.fullName ||
                              report?.employeeName
                            )?.[0]?.toUpperCase() || "?"
                          }
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: "500", color: "#E2E8F0" }}>
                          {report?.employee
                            ? report.employee.fullName
                            : `Deleted Employee | ${report.employeeName}`
                          }
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "13.5px", color: "#94A3B8" }}>
                      {report?.task?.title}
                    </td>
                    {/* <td style={{ padding: "14px 20px" }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        fontSize: "13px", fontWeight: "700", color: "#60A5FA",
                      }}>
                        {report.hoursWorked}h
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                       
                        <div style={{
                          flex: 1, height: "6px", borderRadius: "3px",
                          background: "#1E293B", overflow: "hidden", maxWidth: "100px",
                        }}>
                          <div style={{
                            height: "100%", borderRadius: "3px",
                            width: `${Math.min(report.progressPercentage || 0, 100)}%`,
                            background: report.progressPercentage >= 100
                              ? "#10B981"
                              : report.progressPercentage >= 50
                                ? "#6366F1"
                                : "#F59E0B",
                            transition: "width 0.3s ease",
                          }} />
                        </div>
                        <span style={{
                          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                          fontSize: "12px", fontWeight: "700",
                          color: report.progressPercentage >= 100 ? "#10B981" : "#94A3B8",
                          minWidth: "36px",
                        }}>
                          {report.progressPercentage}%
                        </span>
                      </div>
                    </td> */}
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

export default ReportList;