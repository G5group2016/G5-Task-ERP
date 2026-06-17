import { useState } from "react";
import toast from "react-hot-toast";
import { createSelfTask } from "../../services/taskService";

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#E2E8F0",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

const focusHandlers = {
  onFocus: (e) => {
    e.target.style.borderColor = "rgba(99,102,241,0.5)";
    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
  },
  onBlur: (e) => {
    e.target.style.borderColor = "rgba(255,255,255,0.08)";
    e.target.style.boxShadow = "none";
  },
};

const fieldLabelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "#475569",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: 7,
};

const priorityColors = {
  LOW:    { text: "#10B981", bg: "rgba(16,185,129,0.1)" },
  MEDIUM: { text: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  HIGH:   { text: "#F87171", bg: "rgba(239,68,68,0.1)" },
  URGENT: { text: "#EF4444", bg: "rgba(239,68,68,0.15)" },
};

const SelfTaskForm = ({ onSuccess }) => {

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState("MEDIUM");

  const [loading, setLoading] = useState(false);

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setLoading(true);

      try {

        await createSelfTask({
          title,
          description,
          priority
        });

        toast.success(
          "Task Created"
        );

        setTitle("");
        setDescription("");
        setPriority("MEDIUM");

        if (onSuccess)
          onSuccess();

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Failed"
        );

      } finally {

        setLoading(false);

      }
    };

  const pColor = priorityColors[priority] || priorityColors.MEDIUM;

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
        marginBottom: 28,
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        position: "relative",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Top accent line */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #6366F1 0%, #8B5CF6 60%, transparent 100%)" }} />

      {/* Card header */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D1421", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
          ✦
        </span>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#E2E8F0", letterSpacing: "-0.01em" }}>
          Start Working On Something
        </h3>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} style={{ padding: "20px 24px" }}>
        <div style={{ display: "grid", gap: 14 }}>

          {/* Title */}
          <div>
            <label style={fieldLabelStyle}>Task Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you working on?"
              required
              style={inputStyle}
              {...focusHandlers}
            />
          </div>

          {/* Description */}
          <div>
            <label style={fieldLabelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task…"
              required
              rows={3}
              style={{ ...inputStyle, resize: "vertical", minHeight: 80, lineHeight: 1.6 }}
              {...focusHandlers}
            />
          </div>

          {/* Priority */}
          <div>
            <label style={fieldLabelStyle}>Priority</label>
            <div style={{ position: "relative" }}>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{
                  ...inputStyle,
                  appearance: "none",
                  WebkitAppearance: "none",
                  paddingRight: 36,
                  cursor: "pointer",
                  color: pColor.text,
                  fontWeight: 600,
                }}
                {...focusHandlers}
              >
                <option value="LOW"    style={{ background: "#0D1421", color: "#10B981" }}>Low</option>
                <option value="MEDIUM" style={{ background: "#0D1421", color: "#F59E0B" }}>Medium</option>
                <option value="HIGH"   style={{ background: "#0D1421", color: "#F87171" }}>High</option>
                <option value="URGENT" style={{ background: "#0D1421", color: "#EF4444" }}>Urgent</option>
              </select>
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#475569", fontSize: 12 }}>▾</span>
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 24px",
                borderRadius: 10,
                background: loading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366F1, #4F46E5)",
                border: "none",
                color: loading ? "#94A3B8" : "#fff",
                fontSize: 13.5,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 0 20px rgba(99,102,241,0.35)",
                letterSpacing: "0.01em",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              {loading ? (
                <>
                  <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Creating…
                </>
              ) : "✦ Create Self Task"}
            </button>
          </div>
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default SelfTaskForm;