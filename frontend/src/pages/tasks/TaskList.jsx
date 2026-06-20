import { useEffect, useState } from "react";
import { getTasks, downloadTasksExcel } from "../../services/taskService";
import TaskForm from "./TaskForm";

const priorityConfig = {
  LOW: { color: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", label: "Low" },
  MEDIUM: { color: "#60A5FA", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)", label: "Medium" },
  HIGH: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", label: "High" },
  URGENT: { color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", label: "Urgent" },
};

const statusConfig = {
  PENDING: { color: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", label: "Pending" },
  IN_PROGRESS: { color: "#60A5FA", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)", label: "In Progress" },
  COMPLETED: { color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)", label: "Completed" },
  CANCELLED: { color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", label: "Cancelled" },
};

const Pill = ({ value, config }) => {
  const cfg = config[value?.toUpperCase()] || { color: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", label: value };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "3px 10px", borderRadius: "20px",
      fontSize: "12px", fontWeight: "600", letterSpacing: "0.03em",
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: cfg.color, display: "inline-block" }} />
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

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const user =
    JSON.parse(
      localStorage.getItem("user")
    );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data.tasks);
    setCurrentPage(1);
  };

  // Get current tasks for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = tasks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    document.querySelector('.table-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadExcel =
    async () => {

      try {

        const response =
          await downloadTasksExcel();

        const url =
          window.URL.createObjectURL(
            new Blob([
              response.data
            ])
          );

        const link =
          document.createElement("a");

        link.href = url;

        link.setAttribute(
          "download",
          "Tasks.xlsx"
        );

        document.body.appendChild(link);

        link.click();

        link.remove();

      } catch (error) {

        console.log(error);

      }
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
            Work Management
          </p>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 28px)", fontWeight: "700", color: "#F1F5F9", margin: 0, letterSpacing: "-0.03em" }}>
            Tasks
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
            {tasks.length} total
          </div>

          {user?.role === "OFFICE_MANAGER" && (
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

      {user?.role !==
        "OFFICE_MANAGER" && (
          <TaskForm onSuccess={loadTasks} />
        )}

      {/* Table */}
      <div
        className="table-container"
        style={{
          background: "#111827", borderRadius: "12px",
          border: "1px solid #1E293B", overflow: "hidden",
        }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
            <thead>
              <tr style={{ background: "#0D1421", borderBottom: "1px solid #1E293B" }}>
                {["Employee name", "Task", "Description", "Company", "Priority", "Status"].map((h) => (
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
              {currentTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "48px", textAlign: "center", color: "#475569", fontSize: "14px" }}>
                    No tasks found
                  </td>
                </tr>
              ) : (
                currentTasks.map((task, i) => (
                  <tr
                    key={task._id}
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
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: `hsl(${(
                              task.assignedTo?.fullName ||
                              task.assignedToName ||
                              ""
                            ).charCodeAt(0) * 47 % 360}, 55%, 35%)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "#fff",
                            flexShrink: 0,
                          }}
                        >
                          {(
                            task.assignedTo?.fullName ||
                            task.assignedToName ||
                            "?"
                          )[0]?.toUpperCase()}
                        </div>
                        <span
                          style={{
                            fontSize: "13.5px",
                            color: "#CBD5E1"
                          }}
                        >
                          {task.assignedTo
                            ? task.assignedTo.fullName
                            : `Deleted Employee | ${task.assignedToName}`}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#E2E8F0" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                          }}
                        >
                          <span>
                            {task.title}
                          </span>

                          {task.isSelfAssigned && (
                            <span
                              style={{
                                background:
                                  "rgba(139,92,246,0.15)",
                                color: "#A78BFA",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "11px",
                                fontWeight: "600"
                              }}
                            >
                              Self Assigned
                            </span>
                          )}
                        </div>
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        fontSize: "13px",
                        color: "#94A3B8",
                        minWidth: "300px",
                        maxWidth: "500px",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        lineHeight: "1.5",
                      }}
                    >
                      {task.description || "-"}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "13.5px", color: "#64748B" }}>
                      {task.company?.name || <span style={{ color: "#2D3748" }}>—</span>}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <Pill value={task.priority} config={priorityConfig} />
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <Pill value={task.status} config={statusConfig} />
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

export default TaskList;