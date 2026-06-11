import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { checkIn, checkOut, getAttendance } from "../../services/attendanceService";

const statusConfig = {
  present: { color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", label: "Present" },
  absent:  { color: "#EF4444", bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.25)",  label: "Absent"  },
  late:    { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", label: "Late"    },
};

const StatusBadge = ({ status }) => {
  const key = status?.toLowerCase();
  const cfg = statusConfig[key] || { color: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", label: status };
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
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: cfg.color, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
};

const Attendance = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => { loadAttendance(); }, []);

  const loadAttendance = async () => {
    try {
      const data = await getAttendance();
      setRecords(data.records);
    } catch (error) {
      toast.error("Failed to Load Attendance");
    }
  };

  const handleCheckIn = async () => {
    try {
      await checkIn();
      toast.success("Checked In");
      loadAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
      toast.success("Checked Out");
      loadAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#F1F5F9" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.1em", color: "#6366F1", textTransform: "uppercase", marginBottom: "4px" }}>
            Time Tracking
          </p>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#F1F5F9", margin: 0, letterSpacing: "-0.03em" }}>
            Attendance
          </h1>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleCheckIn}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              border: "none",
              color: "#fff",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
              transition: "all 0.18s ease",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 18px rgba(16,185,129,0.45)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(16,185,129,0.3)"; e.currentTarget.style.transform = "none"; }}
          >
            <span style={{ fontSize: "16px" }}>→</span> Check In
          </button>

          <button
            onClick={handleCheckOut}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "8px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#EF4444",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.18s ease",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.transform = "none"; }}
          >
            <span style={{ fontSize: "16px" }}>←</span> Check Out
          </button>
        </div>
      </div>

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
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
            <thead>
              <tr style={{ background: "#0D1421", borderBottom: "1px solid #1E293B" }}>
                {["Employee", "Date", "Status", "Hours"].map((h) => (
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
              {records.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "48px", textAlign: "center", color: "#475569", fontSize: "14px" }}>
                    No attendance records found
                  </td>
                </tr>
              ) : (
                records.map((record, i) => (
                  <tr
                    key={record._id}
                    style={{
                      borderBottom: "1px solid #1A2233",
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)"; }}
                  >
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "700",
                            color: "#fff",
                            flexShrink: 0,
                          }}
                        >
                          {record?.employee?.fullName?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: "500", color: "#E2E8F0" }}>
                          {record?.employee?.fullName}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "14px", color: "#94A3B8", fontVariantNumeric: "tabular-nums" }}>
                      {new Date(record.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <StatusBadge status={record.status} />
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: record.totalHours >= 8 ? "#10B981" : "#F1F5F9",
                        }}
                      >
                        {record.totalHours ? `${record.totalHours}h` : "—"}
                      </span>
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

export default Attendance;