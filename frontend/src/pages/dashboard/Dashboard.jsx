import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../services/dashboardService";

const StatCard = ({ label, value, accent, icon, delta, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: "#111827",
      borderRadius: "12px",
      border: "1px solid #1E293B",
      padding: "22px 24px",
      position: "relative",
      overflow: "hidden",
      transition: "border-color 0.2s, transform 0.18s",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = `${accent}50`;
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "#1E293B";
      e.currentTarget.style.transform = "none";
    }}
  >
    {/* Glow accent top border */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        opacity: 0.7,
      }}
    />

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p
          style={{
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: "#475569",
            margin: "0 0 12px",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: "clamp(24px, 5vw, 36px)",
            fontWeight: "800",
            color: "#F1F5F9",
            margin: 0,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value ?? <span style={{ color: "#2D3748", fontSize: "28px" }}>—</span>}
        </p>
        {delta !== undefined && (
          <p style={{ fontSize: "12px", color: "#10B981", margin: "8px 0 0", fontWeight: "600" }}>
            {delta}
          </p>
        )}
      </div>
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: `${accent}18`,
          border: `1px solid ${accent}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  const cards = [
    {
      label: "Total Companies",
      value: stats?.totalCompanies,
      accent: "#6366F1",
      icon: "🏢",
      path: "/companies",
    },
    {
      label: "Total Employees",
      value: stats?.totalEmployees,
      accent: "#10B981",
      icon: "👥",
      path: "/employees",
    },
    // {
    //   label: "Active Tasks",
    //   value: stats?.activeTasks,
    //   accent: "#F59E0B",
    //   icon: "⚡",
    //   path: "/tasks",
    // },
    {
      label: "Completed Tasks",
      value: stats?.completedTasks,
      accent: "#3B82F6",
      icon: "✓",
      path: "/completed-tasks",
    },
    {
      label: "Pending Tasks",
      value: stats?.pendingTasks,
      accent: "#EF4444",
      icon: "⏳",
      path: "/pending-tasks",
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#F1F5F9", padding: "0 16px" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.1em", color: "#6366F1", textTransform: "uppercase", marginBottom: "4px" }}>
          Overview
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 28px)", fontWeight: "700", color: "#F1F5F9", margin: 0, letterSpacing: "-0.03em" }}>
            Dashboard
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "20px",
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#10B981" }}>All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {cards.map((card) => (
          <StatCard
            key={card.label}
            {...card}
            onClick={() =>
              navigate(card.path)
            }
          />
        ))}
      </div>

      {/* Quick summary bar */}
      <div
        style={{
          background: "#111827",
          borderRadius: "12px",
          border: "1px solid #1E293B",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#6366F1",
            boxShadow: "0 0 8px #6366F1",
            flexShrink: 0,
          }}
        />
        <p style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>
          Last refreshed:{" "}
          <span style={{ color: "#94A3B8", fontWeight: "500" }}>
            {new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </span>
        </p>
        <button
          onClick={loadDashboard}
          style={{
            marginLeft: "auto",
            padding: "5px 14px",
            borderRadius: "6px",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.25)",
            color: "#6366F1",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default Dashboard;