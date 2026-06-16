import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getEmployee,
  getEmployeeTasks,
  getEmployeeAttendance,
  getEmployeeReports,
  getEmployeeAuditLogs, changeEmployeeRole
} from "../../services/employeeService";

const tabs = [
  { key: "profile", label: "Profile", icon: "👤" },
  { key: "tasks", label: "Tasks", icon: "⚡" },
  { key: "attendance", label: "Attendance", icon: "🕐" },
  { key: "reports", label: "Reports", icon: "📋" },
  { key: "audit", label: "Audit", icon: "🛡️" },
];

const roleColors = {
  SUPER_ADMIN: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", text: "#F87171" },
  COMPANY_ADMIN: { bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.3)", text: "#818CF8" },
  TEAM_LEAD: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", text: "#F59E0B" },
  EMPLOYEE: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", text: "#10B981" },
};

const taskStatusConfig = {
  COMPLETED: { dot: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", text: "#10B981", label: "Completed" },
  IN_PROGRESS: { dot: "#6366F1", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.3)", text: "#818CF8", label: "In Progress" },
  PENDING: { dot: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", text: "#F59E0B", label: "Pending" },
};

const priorityConfig = {
  HIGH: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", text: "#F87171", label: "High" },
  MEDIUM: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", text: "#F59E0B", label: "Medium" },
  LOW: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", text: "#10B981", label: "Low" },
};

const attendanceStatusConfig = {
  PRESENT: { dot: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", text: "#10B981", label: "Present" },
  ABSENT: { dot: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", text: "#F87171", label: "Absent" },
  LATE: { dot: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", text: "#F59E0B", label: "Late" },
  HALF_DAY: { dot: "#8B5CF6", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.25)", text: "#A78BFA", label: "Half Day" },
};

function StatusBadge({ status, config }) {
  const cfg = config[status] || { dot: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", text: "#94A3B8", label: status || "—" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px 3px 7px", borderRadius: 20, background: cfg.bg, border: `1px solid ${cfg.border}`, fontSize: 12, fontWeight: 600, color: cfg.text, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot || cfg.text, boxShadow: `0 0 6px ${cfg.dot || cfg.text}`, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const cfg = priorityConfig[priority] || { bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", text: "#94A3B8", label: priority || "—" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, background: cfg.bg, border: `1px solid ${cfg.border}`, fontSize: 12, fontWeight: 600, color: cfg.text, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
      {cfg.label}
    </span>
  );
}

const EmployeeProfile = () => {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [reports, setReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const currentUser =
    JSON.parse(
      localStorage.getItem("user")
    );

  const [activeTab, setActiveTab] =
    useState("profile");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const employeeData =
        await getEmployee(id);

      setEmployee(employeeData);

      const taskData =
        await getEmployeeTasks(id);

      setTasks(
        taskData.tasks || []
      );

      const attendanceData =
        await getEmployeeAttendance(id);

      setAttendance(
        attendanceData.attendance || []
      );

      const reportData =
        await getEmployeeReports(id);

      setReports(
        reportData.reports || []
      );

      const auditData =
        await getEmployeeAuditLogs(id);

      setAuditLogs(
        auditData.logs || []
      );

    } catch (error) {
      console.log(error);
    }
  };

  const handleRoleChange =
    async (newRole) => {

      try {
        if (
          employee._id === currentUser._id
        ) {
          toast.error(
            "You cannot change your own role"
          );
          return;
        }
        await changeEmployeeRole(
          employee._id,
          newRole
        );

        toast.success(
          "Role Updated"
        );

        loadData();

      } catch (error) {

        toast.error(
          error.response?.data?.message
        );

      }

    };

  if (!employee) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 14, fontFamily: "'Inter', system-ui, sans-serif", color: "#E2E8F0" }}>
        <div style={{ width: 36, height: 36, border: "2px solid rgba(99,102,241,0.2)", borderTopColor: "#6366F1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <span style={{ color: "#64748B", fontSize: 14 }}>Loading employee…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const rCfg = roleColors[employee.role] || { bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", text: "#94A3B8" };

  return (
    <div
      style={{
        padding: "20px",
        color: "#F1F5F9",
        fontFamily:
          "'Inter', system-ui, sans-serif"
      }}
    >

      {/* Header */}

      <div
        style={{
          background: "#111827",
          border:
            "1px solid #1E293B",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "20px",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ height: 3, background: "linear-gradient(90deg, #6366F1 0%, #8B5CF6 60%, transparent 100%)", position: "absolute", top: 0, left: 0, right: 0 }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >

          {employee.profileImage ? (
            <img
              src={
                employee.profileImage
              }
              alt=""
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                objectFit: "cover",
                border:
                  "3px solid #6366F1",
                boxShadow: "0 0 24px rgba(99,102,241,0.25)",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#6366F1,#4F46E5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: "700",
                border: "3px solid rgba(99,102,241,0.4)",
                boxShadow: "0 0 24px rgba(99,102,241,0.2)",
                flexShrink: 0,
              }}
            >
              {
                employee.fullName?.[0]
              }
            </div>
          )}

          <div>

            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {
                employee.fullName
              }
            </h2>

            <p
              style={{
                color: "#94A3B8",
                margin:
                  "8px 0",
                fontSize: "14px",
              }}
            >
              {employee.email}
            </p>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background:
                  rCfg.bg,
                color:
                  rCfg.text,
                border: `1px solid ${rCfg.border}`,
                padding:
                  "4px 12px",
                borderRadius:
                  "20px",
                fontSize:
                  "12px",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "capitalize",
              }}
            >
              {employee.role?.replaceAll("_", " ")}
            </span>

          </div>

        </div>

      </div>

      {/* Stats */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: "15px",
          marginBottom: "20px"
        }}
      >

        <StatCard
          title="Tasks"
          value={tasks.length}
          icon="⚡"
          from="#6366F1"
          to="#4F46E5"
        />

        <StatCard
          title="Reports"
          value={reports.length}
          icon="📋"
          from="#F59E0B"
          to="#D97706"
        />

        <StatCard
          title="Attendance"
          value={
            attendance.length
          }
          icon="🕐"
          from="#10B981"
          to="#059669"
        />

        <StatCard
          title="Changes"
          value={
            auditLogs.length
          }
          icon="🛡️"
          from="#8B5CF6"
          to="#7C3AED"
        />

      </div>

      {/* Tabs */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap"
        }}
      >

        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(
                  tab.key
                )
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background:
                  isActive
                    ? "linear-gradient(135deg, #6366F1, #4F46E5)"
                    : "#111827",
                color:
                  isActive ? "#fff" : "#94A3B8",
                border: isActive
                  ? "1px solid rgba(99,102,241,0.4)"
                  : "1px solid #1E293B",
                padding:
                  "10px 18px",
                borderRadius:
                  "10px",
                cursor:
                  "pointer",
                fontSize: "13.5px",
                fontWeight: 600,
                letterSpacing: "0.01em",
                boxShadow: isActive ? "0 0 20px rgba(99,102,241,0.35)" : "none",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "#E2E8F0"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "#94A3B8"; }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}

      </div>

      {/* Content */}

      <div
        style={{
          background:
            "#111827",
          border:
            "1px solid #1E293B",
          borderRadius:
            "16px",
          padding:
            "24px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        }}
      >

        {activeTab ===
          "profile" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "20px"
              }}
            >
              <Info
                label="Name"
                value={
                  employee.fullName
                }
              />

              <Info
                label="Email"
                value={
                  employee.email
                }
              />

              <Info
                label="Phone"
                value={
                  employee.phone
                }
              />

              <Info
                label="Department"
                value={
                  employee.department
                }
              />

              <Info
                label="Designation"
                value={
                  employee.designation
                }
              />
              {(
                currentUser?.role === "SUPER_ADMIN" ||
                currentUser?.role === "COMPANY_ADMIN"
              ) && (
                  <div>
                    <p
                      style={{
                        color: "#64748B",
                        marginBottom: "8px",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      Role
                    </p>

                    <div style={{ position: "relative", display: "inline-block" }}>
                      <select
                        value={employee.role}
                        onChange={(e) =>
                          handleRoleChange(
                            e.target.value
                          )
                        }
                        style={{
                          appearance: "none",
                          WebkitAppearance: "none",
                          background: "#0D1421",
                          color: "#E2E8F0",
                          border: "1px solid rgba(255,255,255,0.08)",
                          padding: "10px 40px 10px 14px",
                          borderRadius: "10px",
                          width: "220px",
                          fontSize: "14px",
                          fontWeight: 500,
                          fontFamily: "'Inter', system-ui, sans-serif",
                          cursor: "pointer",
                          outline: "none",
                          transition: "border-color 0.15s, box-shadow 0.15s",
                        }}
                        onFocus={e => {
                          e.target.style.borderColor = "rgba(99,102,241,0.5)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
                        }}
                        onBlur={e => {
                          e.target.style.borderColor = "rgba(255,255,255,0.08)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        <option value="EMPLOYEE" style={{ background: "#0D1421" }}>
                          Employee
                        </option>

                        <option value="TEAM_LEAD" style={{ background: "#0D1421" }}>
                          Team Lead
                        </option>

                        <option value="COMPANY_ADMIN" style={{ background: "#0D1421" }}>
                          Head Of Department
                        </option>

                        {currentUser?.role ===
                          "SUPER_ADMIN" && (
                            <option value="OFFICE_MANAGER" style={{ background: "#0D1421" }}>
                              Office Manager
                            </option>
                          )}
                      </select>

                      {/* Custom chevron */}
                      <span style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        color: "#475569",
                        fontSize: 12,
                      }}>
                        ▾
                      </span>
                    </div>
                  </div>
                )}

              <Info
                label="Company"
                value={
                  employee.company
                    ?.name
                }
              />
            </div>
          )
        }

        {
          activeTab ===
          "tasks" && (
            <Table
              headers={["Title", "Status", "Priority"]}
              empty={tasks.length === 0}
              emptyText="No tasks found"
              emptyIcon="⚡"
            >
              {tasks.map(
                (task, idx) => (
                  <Row key={task._id} idx={idx}>
                    <Cell first>{task.title}</Cell>
                    <Cell><StatusBadge status={task.status} config={taskStatusConfig} /></Cell>
                    <Cell><PriorityBadge priority={task.priority} /></Cell>
                  </Row>
                )
              )}
            </Table>
          )
        }

        {
          activeTab ===
          "attendance" && (
            <Table
              headers={["Date", "Status", "Hours"]}
              empty={attendance.length === 0}
              emptyText="No attendance records found"
              emptyIcon="🕐"
            >
              {attendance.map(
                (item, idx) => (
                  <Row key={item._id} idx={idx}>
                    <Cell first>
                      {new Date(
                        item.date
                      ).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </Cell>
                    <Cell><StatusBadge status={item.status} config={attendanceStatusConfig} /></Cell>
                    <Cell mono>{item.totalHours ?? "—"}</Cell>
                  </Row>
                )
              )}
            </Table>
          )
        }

        {
          activeTab ===
          "reports" && (
            <Table
              headers={["Task", "Hours", "Progress"]}
              empty={reports.length === 0}
              emptyText="No reports found"
              emptyIcon="📋"
            >
              {reports.map(
                (report, idx) => (
                  <Row key={report._id} idx={idx}>
                    <Cell first>{report.task?.title || "—"}</Cell>
                    <Cell mono>{report.hoursWorked}h</Cell>
                    <Cell>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 12, fontWeight: 600, color: "#10B981", fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
                        {report.progressPercentage}%
                      </span>
                    </Cell>
                  </Row>
                )
              )}
            </Table>
          )
        }

        {
          activeTab ===
          "audit" && (
            <Table
              headers={["Field", "Old Value", "New Value", "Changed By", "Date"]}
              empty={auditLogs.length === 0}
              emptyText="No audit logs found"
              emptyIcon="🛡️"
            >
              {auditLogs.map(
                (log, idx) => (
                  <Row key={log._id} idx={idx}>
                    <Cell first mono>{log.field}</Cell>
                    <Cell muted>{log.oldValue ?? "—"}</Cell>
                    <Cell>{log.newValue ?? "—"}</Cell>
                    <Cell>{log.changedBy?.fullName || "—"}</Cell>
                    <Cell muted>
                      {new Date(
                        log.createdAt
                      ).toLocaleString()}
                    </Cell>
                  </Row>
                )
              )}
            </Table>
          )
        }

      </div >

    </div >
  );
};

const StatCard = ({
  title,
  value,
  icon,
  from,
  to,
}) => (
  <div
    style={{
      background:
        "#111827",
      border:
        "1px solid #1E293B",
      borderRadius:
        "16px",
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      position: "relative",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)"; }}
  >
    <div style={{ height: 3, background: `linear-gradient(90deg, ${from}, ${to})` }} />
    <div style={{ padding: "18px 20px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p
          style={{
            color:
              "#64748B",
            margin: 0,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </p>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${from}28, ${to}14)`, border: `1px solid ${from}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
          {icon}
        </span>
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: "32px",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: "#F1F5F9",
        }}
      >
        {value}
      </h2>
    </div>
  </div>
);

const Info = ({
  label,
  value
}) => (
  <div>
    <p
      style={{
        color:
          "#64748B",
        marginBottom:
          "6px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </p>

    <p style={{ margin: 0, fontSize: "14.5px", color: "#E2E8F0", fontWeight: 500 }}>
      {value || "-"}
    </p>
  </div>
);

const Table = ({
  headers,
  children,
  empty,
  emptyText,
  emptyIcon,
}) => (
  <div
    style={{
      overflowX:
        "auto",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <table
      style={{
        width:
          "100%",
        borderCollapse:
          "collapse",
        fontSize: 14,
      }}
    >
      <thead>
        <tr style={{ background: "#0D1421", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {headers.map((h, i) => (
            <th
              key={h}
              style={{
                padding: i === 0 ? "13px 20px 13px 20px" : "13px 20px",
                textAlign: "left",
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#64748B",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {empty ? (
          <tr>
            <td colSpan={headers.length} style={{ padding: "56px 24px", textAlign: "center" }}>
              <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <span style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{emptyIcon}</span>
                <div style={{ color: "#64748B", fontSize: 13 }}>{emptyText}</div>
              </div>
            </td>
          </tr>
        ) : children}
      </tbody>
    </table>
  </div>
);

const Row = ({ idx, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isOdd = idx % 2 !== 0;
  return (
    <tr
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered ? "rgba(99,102,241,0.07)" : isOdd ? "rgba(255,255,255,0.018)" : "transparent",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        transition: "background 0.15s ease",
      }}
    >
      {children}
    </tr>
  );
};

const Cell = ({ children, first, mono, muted }) => (
  <td
    style={{
      padding: first ? "13px 20px 13px 20px" : "13px 20px",
      fontWeight: first ? 500 : 400,
      color: muted ? "#64748B" : first ? "#E2E8F0" : "#94A3B8",
      fontFamily: mono ? "'JetBrains Mono','Fira Code',monospace" : "inherit",
      fontSize: mono ? 13 : 14,
    }}
  >
    {children}
  </td>
);

export default EmployeeProfile;