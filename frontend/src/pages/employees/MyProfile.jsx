import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProfile, updateProfile, } from "../../services/authService";
import ChangePassword from "../../components/profile/ChangePassword";
import {
  getMyRequest, uploadProfileImageRequest,
}
  from "../../services/profileImageRequestService";

const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
  color: "#E2E8F0", fontSize: 14, outline: "none", boxSizing: "border-box",
  fontFamily: "'Inter', system-ui, sans-serif", transition: "border-color 0.15s, box-shadow 0.15s",
};

const disabledInputStyle = {
  ...inputStyle,
  background: "rgba(255,255,255,0.02)", color: "#475569", cursor: "not-allowed",
};

function FieldLabel({ children }) {
  return (
    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>
      {children}
    </label>
  );
}

function getAvatarColor(name = "") {
  const colors = [["#6366F1", "#4F46E5"], ["#8B5CF6", "#7C3AED"], ["#EC4899", "#DB2777"], ["#F59E0B", "#D97706"], ["#10B981", "#059669"], ["#3B82F6", "#2563EB"]];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [
    requestStatus,
    setRequestStatus
  ] = useState(null);

  useEffect(() => { loadProfile(); loadRequestStatus(); }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setUser(data);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const loadRequestStatus =
    async () => {

      try {

        const data =
          await getMyRequest();

        setRequestStatus(
          data.request
        );

      } catch (error) {

        console.log(error);

      }
    };

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ fullName: user.fullName, phone: user.phone, designation: user.designation, department: user.department });
      toast.success("Profile Updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update Failed");
    }
  };

  const handleImageUpload =
    async () => {

      if (!image) {

        return toast.error(
          "Select an image"
        );

      }

      try {

        await uploadProfileImageRequest(
          image
        );

        toast.success(
          "Profile image request submitted"
        );

        loadRequestStatus();

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Request failed"
        );

      }

    };



  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 14, fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ width: 36, height: 36, border: "2px solid rgba(99,102,241,0.2)", borderTopColor: "#6366F1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <span style={{ color: "#64748B", fontSize: 14 }}>Loading profile…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const [avatarFrom, avatarTo] = getAvatarColor(user?.fullName || "");
  const initials = (user?.fullName || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#E2E8F0", maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.08))", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
            👤
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 700, background: "linear-gradient(135deg, #F1F5F9 60%, #94A3B8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, letterSpacing: "-0.02em" }}>
            My Profile
          </h1>
        </div>
        <p style={{ color: "#64748B", fontSize: 13.5, margin: 0 }}>Manage your personal information and account settings.</p>
      </div>

      {/* Main card */}
      <div style={{ background: "#111827", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.35)", position: "relative" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg, #6366F1 0%, #8B5CF6 60%, transparent 100%)" }} />
        <div style={{ padding: "28px" }}>
          <div style={{ display: "flex", flexDirection: "row", gap: 36, flexWrap: "wrap" }}>

            {/* Avatar column */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, minWidth: 160 }}>
              {requestStatus && (

                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background:
                      requestStatus.status === "APPROVED"
                        ? "rgba(16,185,129,0.15)"
                        : requestStatus.status === "REJECTED"
                          ? "rgba(239,68,68,0.15)"
                          : "rgba(245,158,11,0.15)",
                    color:
                      requestStatus.status === "APPROVED"
                        ? "#10B981"
                        : requestStatus.status === "REJECTED"
                          ? "#EF4444"
                          : "#F59E0B",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  Image Request:
                  {" "}
                  {requestStatus.status}
                </div>

              )}
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(99,102,241,0.5)", boxShadow: "0 0 24px rgba(99,102,241,0.25)" }}
                />
              ) : (
                <div style={{ width: 120, height: 120, borderRadius: "50%", background: `linear-gradient(135deg, ${avatarFrom}, ${avatarTo})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 800, color: "#fff", border: "3px solid rgba(99,102,241,0.4)", boxShadow: "0 0 24px rgba(99,102,241,0.2)", letterSpacing: "-0.02em" }}>
                  {initials}
                </div>
              )}

              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center" }}>Upload Photo</label>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  style={{ fontSize: 12, color: "#94A3B8", cursor: "pointer" }}
                />
                <button
                  onClick={handleImageUpload}
                  disabled={
                    requestStatus?.status ===
                    "PENDING"
                  }
                  style={{
                    padding: "9px 16px",
                    borderRadius: 10,
                    background:
                      requestStatus?.status === "PENDING"
                        ? "#475569"
                        : "linear-gradient(135deg, #F59E0B, #D97706)",
                    border: "none",
                    color: "#0A0F1E",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor:
                      requestStatus?.status === "PENDING"
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {requestStatus?.status === "PENDING"
                    ? "Request Pending"
                    : "Upload Image"}
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdate} style={{ flex: 1, minWidth: 260, display: "grid", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <FieldLabel>Full Name</FieldLabel>
                  <input type="text" name="fullName" value={user?.fullName || ""} onChange={handleChange} style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }} />
                </div>
                <div>
                  <FieldLabel>Email</FieldLabel>
                  <input type="email" value={user?.email || ""} disabled style={disabledInputStyle} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <FieldLabel>Phone</FieldLabel>
                  <input type="text" name="phone" value={user?.phone || ""} onChange={handleChange} placeholder="Phone" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }} />
                </div>
                <div>
                  <FieldLabel>Designation</FieldLabel>
                  <input type="text" name="designation" value={user?.designation || ""} onChange={handleChange} placeholder="Designation" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <FieldLabel>Department</FieldLabel>
                  <input type="text" name="department" value={user?.department || ""} onChange={handleChange} placeholder="Department" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }} />
                </div>
                <div>
                  <FieldLabel>Role</FieldLabel>
                  <input type="text" value={user?.role || ""} disabled style={disabledInputStyle} />
                </div>
              </div>

              <div>
                <FieldLabel>Company</FieldLabel>
                <input type="text" value={user?.company?.name || ""} disabled style={disabledInputStyle} />
              </div>

              <div>
                <button type="submit" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 10, background: "linear-gradient(135deg, #10B981, #059669)", border: "none", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 20px rgba(16,185,129,0.25)", letterSpacing: "0.01em" }}>
                  ✓ Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "28px 0" }} />
          <ChangePassword />
        </div>
      </div>
    </div>
  );
};

export default MyProfile;