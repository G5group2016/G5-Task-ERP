import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getProfileRequests,
  approveRequest,
  rejectRequest,
} from "../../services/profileImageRequestService";

const statusConfig = {
  PENDING: { dot: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", text: "#F59E0B", label: "Pending" },
  APPROVED: { dot: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", text: "#10B981", label: "Approved" },
  REJECTED: { dot: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", text: "#F87171", label: "Rejected" },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { dot: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", text: "#94A3B8", label: status };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px 3px 7px", borderRadius: 20, background: cfg.bg, border: `1px solid ${cfg.border}`, fontSize: 12, fontWeight: 600, color: cfg.text, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}`, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

function getAvatarColor(name = "") {
  const colors = [
    ["#6366F1","#4F46E5"],["#8B5CF6","#7C3AED"],["#EC4899","#DB2777"],
    ["#F59E0B","#D97706"],["#10B981","#059669"],["#3B82F6","#2563EB"],
    ["#EF4444","#DC2626"],["#14B8A6","#0D9488"],
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function Avatar({ name = "" }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const [from, to] = getAvatarColor(name);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 32, height: 32, borderRadius: "50%",
      background: `linear-gradient(135deg, ${from}, ${to})`,
      fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.04em",
      flexShrink: 0, boxShadow: "0 0 0 2px rgba(99,102,241,0.18)",
    }}>
      {initials || "?"}
    </span>
  );
}

const ProfileImageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [actioningId, setActioningId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    setLoading(true);
    const data = await getProfileRequests();
    setRequests(data.requests);
    setLoading(false);
  };

  const handleApprove = async (id) => {
    setActioningId(id);
    try {
      await approveRequest(id);
      toast.success("Image Approved");
      loadRequests();
    } catch (error) {
      toast.error("Failed");
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id) => {
    setActioningId(id);
    try {
      await rejectRequest(id);
      toast.success("Image Rejected");
      loadRequests();
    } catch (error) {
      toast.error("Failed");
    } finally {
      setActioningId(null);
    }
  };

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#E2E8F0" }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.08))", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
              🖼️
            </span>
            <h1 style={{ fontSize: 26, fontWeight: 700, background: "linear-gradient(135deg, #F1F5F9 60%, #94A3B8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, letterSpacing: "-0.02em" }}>
              Profile Image Requests
            </h1>
          </div>
          <p style={{ color: "#64748B", fontSize: 13.5, margin: 0 }}>
            Review and moderate profile picture changes submitted by employees.
          </p>
        </div>

        {!loading && pendingCount > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 24, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", fontSize: 13, fontWeight: 600, color: "#F59E0B" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#F59E0B", boxShadow: "0 0 8px #F59E0B" }} />
            {pendingCount} pending review
          </div>
        )}
      </div>

      {/* Table card */}
      <div style={{ background: "#111827", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.35)", position: "relative" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg, #6366F1 0%, #8B5CF6 60%, transparent 100%)", position: "absolute", top: 0, left: 0, right: 0 }} />

        {loading ? (
          <div style={{ padding: "60px 24px", textAlign: "center", color: "#475569", fontSize: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, border: "2px solid rgba(99,102,241,0.2)", borderTopColor: "#6366F1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            Loading requests…
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#0D1421", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Employee", "Image", "Status", "Action"].map((col, i) => (
                  <th key={col} style={{ padding: i === 0 ? "13px 20px 13px 24px" : "13px 20px", textAlign: "left", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748B" }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "56px 24px", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                      <span style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🖼️</span>
                      <div style={{ color: "#E2E8F0", fontWeight: 600, marginBottom: 4 }}>No image requests</div>
                      <div style={{ color: "#64748B", fontSize: 13 }}>Profile picture change requests will appear here.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((request, idx) => {
                  const isHovered = hoveredRow === request._id;
                  const isOdd = idx % 2 !== 0;
                  const isActioning = actioningId === request._id;
                  return (
                    <tr
                      key={request._id}
                      onMouseEnter={() => setHoveredRow(request._id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{ background: isHovered ? "rgba(99,102,241,0.07)" : isOdd ? "rgba(255,255,255,0.018)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s ease" }}
                    >
                      {/* Employee */}
                      <td style={{ padding: "14px 20px 14px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar name={request.employee?.fullName || ""} />
                          <span style={{ color: "#CBD5E1", fontWeight: 500 }}>
                            {request.employee?.fullName || (
                              <span style={{ color: "#475569", fontStyle: "italic" }}>Unknown</span>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Image */}
                      <td style={{ padding: "14px 20px" }}>
                        <img
                          src={request.imageUrl}
                          alt=""
                          width="56"
                          height="56"
                          onClick={() => setPreviewImage(request.imageUrl)}
                          style={{ borderRadius: 10, objectFit: "cover", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 2px 10px rgba(0,0,0,0.3)", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.35)"; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)"; }}
                        />
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 20px" }}>
                        <StatusBadge status={request.status} />
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "14px 20px" }}>
                        {request.status === "PENDING" ? (
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              onClick={() => handleApprove(request._id)}
                              disabled={isActioning}
                              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 9, background: isActioning ? "rgba(16,185,129,0.3)" : "linear-gradient(135deg, #10B981, #059669)", border: "none", color: isActioning ? "#94A3B8" : "#fff", fontSize: 12.5, fontWeight: 700, cursor: isActioning ? "not-allowed" : "pointer", boxShadow: isActioning ? "none" : "0 0 16px rgba(16,185,129,0.25)", letterSpacing: "0.01em", transition: "opacity 0.15s" }}
                              onMouseEnter={e => !isActioning && (e.currentTarget.style.opacity = "0.85")}
                              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleReject(request._id)}
                              disabled={isActioning}
                              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 9, background: isActioning ? "rgba(239,68,68,0.3)" : "linear-gradient(135deg, #EF4444, #DC2626)", border: "none", color: isActioning ? "#94A3B8" : "#fff", fontSize: 12.5, fontWeight: 700, cursor: isActioning ? "not-allowed" : "pointer", boxShadow: isActioning ? "none" : "0 0 16px rgba(239,68,68,0.25)", letterSpacing: "0.01em", transition: "opacity 0.15s" }}
                              onMouseEnter={e => !isActioning && (e.currentTarget.style.opacity = "0.85")}
                              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                            >
                              ✕ Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "#475569", fontSize: 12.5, fontStyle: "italic" }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Full-size image preview modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(8,13,26,0.85)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, cursor: "zoom-out", padding: 24,
          }}
        >
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
            <img
              src={previewImage}
              alt="Full size preview"
              style={{
                maxWidth: "90vw", maxHeight: "90vh", borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.15)",
                objectFit: "contain", display: "block",
              }}
            />
            <button
              onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
              style={{
                position: "absolute", top: -16, right: -16,
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #EF4444, #DC2626)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(239,68,68,0.4)",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImageRequests;