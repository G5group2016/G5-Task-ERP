import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { checkIn, checkOut, getMyAttendance } from "../../services/attendanceService";

const attendanceStatusConfig = {
  PRESENT: { dot: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", text: "#10B981", label: "Present" },
  ABSENT: { dot: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", text: "#F87171", label: "Absent" },
  LATE: { dot: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", text: "#F59E0B", label: "Late" },
  HALF_DAY: { dot: "#8B5CF6", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.25)", text: "#A78BFA", label: "Half Day" },
};

function StatusBadge({ status }) {
  const cfg = attendanceStatusConfig[status] || { dot: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", text: "#94A3B8", label: status };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px 3px 7px", borderRadius: 20, background: cfg.bg, border: `1px solid ${cfg.border}`, fontSize: 12, fontWeight: 600, color: cfg.text, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}`, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

const MyAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => { loadAttendance(); }, []);

  const loadAttendance = async () => {
    try {
      const data = await getMyAttendance();
      setRecords(data);
    } catch (error) {
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await checkIn();
      toast.success("Checked In Successfully");
      loadAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message || "Check In Failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
      toast.success("Checked Out Successfully");
      loadAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message || "Check Out Failed");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 14, fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ width: 36, height: 36, border: "2px solid rgba(99,102,241,0.2)", borderTopColor: "#6366F1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <span style={{ color: "#64748B", fontSize: 14 }}>Loading attendance…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#E2E8F0" }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.08))", border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
              🕐
            </span>
            <h1 style={{ fontSize: 26, fontWeight: 700, background: "linear-gradient(135deg, #F1F5F9 60%, #94A3B8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, letterSpacing: "-0.02em" }}>
              My Attendance
            </h1>
          </div>
          <p style={{ color: "#64748B", fontSize: 13.5, margin: 0 }}>Track your daily check-ins and attendance history.</p>
        </div>

        {/* Check-in / Check-out buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleCheckIn}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg, #10B981, #059669)", border: "none", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 20px rgba(16,185,129,0.3)", letterSpacing: "0.01em", transition: "opacity 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            ↓ Check In
          </button>
          <button
            onClick={handleCheckOut}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg, #EF4444, #DC2626)", border: "none", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 20px rgba(239,68,68,0.3)", letterSpacing: "0.01em", transition: "opacity 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            ↑ Check Out
          </button>
        </div>
      </div>

      {/* Table card */}
      <div style={{ background: "#111827", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.35)", position: "relative" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg, #10B981 0%, #6366F1 60%, transparent 100%)", position: "absolute", top: 0, left: 0, right: 0 }} />

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#0D1421", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Date", "Check In", "Check Out", "Hours", "Status"].map((col, i) => (
                <th key={col} style={{ padding: i === 0 ? "13px 20px 13px 24px" : "13px 20px", textAlign: "left", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748B" }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "56px 24px", textAlign: "center" }}>
                  <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🕐</span>
                    <div style={{ color: "#E2E8F0", fontWeight: 600, marginBottom: 4 }}>No attendance records</div>
                    <div style={{ color: "#64748B", fontSize: 13 }}>Check in to start tracking your attendance.</div>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((record, idx) => {
                const isHovered = hoveredRow === record._id;
                const isOdd = idx % 2 !== 0;
                return (
                  <tr
                    key={record._id}
                    onMouseEnter={() => setHoveredRow(record._id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ background: isHovered ? "rgba(99,102,241,0.07)" : isOdd ? "rgba(255,255,255,0.018)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s ease" }}
                  >
                    <td style={{ padding: "13px 20px 13px 24px", fontWeight: 500, color: "#E2E8F0" }}>
                      {new Date(record.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "13px 20px", fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 13, color: record.checkIn ? "#10B981" : "#475569" }}>
                      {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                    </td>
                    <td style={{ padding: "13px 20px", fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 13, color: record.checkOut ? "#EF4444" : "#475569" }}>
                      {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                    </td>
                    <td style={{ padding: "13px 20px", fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 13, color: "#94A3B8", fontWeight: 600 }}>
                      {record.totalHours || "—"}
                    </td>
                    <td style={{ padding: "13px 20px" }}>
                      <StatusBadge status={record.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAttendance;