import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getMyTasks,
  updateTaskStatus,
} from "../../services/taskService";

const MyTasks = () => {
  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data =
        await getMyTasks();

      setTasks(data);
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate =
    async (taskId, status) => {
      try {
        await updateTaskStatus(
          taskId,
          status
        );

        toast.success(
          "Task Updated Successfully"
        );

        loadTasks();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to update task"
        );
      }
    };

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg">
        Loading Tasks...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">

      <h1 className="text-3xl md:text-4xl font-bold mb-6">
        My Tasks
      </h1>

      {tasks.length === 0 ? (
        <div className="bg-slate-800 p-6 rounded-xl text-center">
          No Tasks Assigned
        </div>
      ) : (
        <div className="grid gap-5">

          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-slate-800 p-6 rounded-xl border border-slate-700"
            >

              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                <div>
                  <h2 className="text-xl font-bold">
                    {task.title}
                  </h2>

                  <p className="text-slate-300 mt-2">
                    {task.description}
                  </p>
                </div>

              </div>

              <div className="mt-4 flex flex-wrap gap-3">

                <span className="bg-blue-600 px-3 py-1 rounded text-sm">
                  Priority:
                  {" "}
                  {task.priority}
                </span>

                <span
                  className={`px-3 py-1 rounded text-sm ${
                    task.status ===
                    "COMPLETED"
                      ? "bg-green-600"
                      : task.status ===
                        "IN_PROGRESS"
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  }`}
                >
                  Status:
                  {" "}
                  {task.status}
                </span>

              </div>

              <div className="mt-5">

                <div className="w-full bg-slate-700 rounded-full h-3">

                  <div
                    className={`h-3 rounded-full ${
                      task.status ===
                      "COMPLETED"
                        ? "bg-green-500"
                        : task.status ===
                          "IN_PROGRESS"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                    style={{
                      width:
                        task.status ===
                        "COMPLETED"
                          ? "100%"
                          : task.status ===
                            "IN_PROGRESS"
                          ? "60%"
                          : "20%",
                    }}
                  />

                </div>

              </div>

              <div className="mt-5 text-sm text-slate-300">

                <p>
                  Due Date:
                  {" "}
                  {task.dueDate
                    ? new Date(
                        task.dueDate
                      ).toLocaleDateString()
                    : "N/A"}
                </p>

                {task.company && (
                  <p className="mt-1">
                    Company:
                    {" "}
                    {task.company?.name}
                  </p>
                )}

                {task.assignedBy && (
                  <p className="mt-1">
                    Assigned By:
                    {" "}
                    {task.assignedBy
                      ?.fullName}
                  </p>
                )}

              </div>

              <div className="mt-6 flex flex-wrap gap-3">

                {task.status ===
                  "PENDING" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        task._id,
                        "IN_PROGRESS"
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                  >
                    Start Task
                  </button>
                )}

                {task.status ===
                  "IN_PROGRESS" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        task._id,
                        "COMPLETED"
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                  >
                    Complete Task
                  </button>
                )}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default MyTasks;