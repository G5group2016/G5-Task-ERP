import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  getMyReports,
  submitReport,
} from "../../services/reportService";

import {
  getMyTasks,
} from "../../services/taskService";

const MyReports = () => {

  const [reports,
    setReports] =
    useState([]);

  const [tasks,
    setTasks] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [formData,
    setFormData] =
    useState({
      task: "",
      workDescription: "",
      hoursWorked: "",
      progressPercentage: "",
    });

  useEffect(() => {
    loadData();
  }, []);

  const loadData =
    async () => {

      try {

        const reportData =
          await getMyReports();

        const taskData =
          await getMyTasks();

        const completedTasks =
          taskData.filter(
            (task) =>
              task.status ===
              "COMPLETED"
          );

        setReports(
          reportData
        );

        setTasks(
          completedTasks
        );

      } catch (error) {

        toast.error(
          "Failed to load reports"
        );

      } finally {

        setLoading(false);

      }
    };

  const handleChange =
    (e) => {

      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value,
      });

    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (!formData.task) {
        return toast.error(
          "Please select a task"
        );
      }

      try {

        await submitReport(
          formData
        );

        toast.success(
          "Report Submitted"
        );

        setFormData({
          task: "",
          workDescription: "",
          hoursWorked: "",
          progressPercentage: "",
        });

        loadData();

      } catch (error) {

        toast.error(
          error.response?.data
            ?.message ||
            "Failed to submit report"
        );

      }
    };

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <div>

      <h1 className="text-4xl font-bold mb-6">
        My Reports
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="bg-slate-800 p-6 rounded-xl mb-8"
      >

        <h2 className="text-xl font-bold mb-4">
          Submit Report
        </h2>

        <select
          name="task"
          value={
            formData.task
          }
          onChange={
            handleChange
          }
          className="w-full p-3 bg-slate-700 rounded mb-4"
        >

          <option value="">
            Select Completed Task
          </option>

          {tasks.map(
            (task) => (
              <option
                key={
                  task._id
                }
                value={
                  task._id
                }
              >
                {task.title}
              </option>
            )
          )}

        </select>

        <textarea
          name="workDescription"
          placeholder="Describe the work completed"
          value={
            formData.workDescription
          }
          onChange={
            handleChange
          }
          className="w-full p-3 bg-slate-700 rounded mb-4"
        />

        <input
          type="number"
          name="hoursWorked"
          placeholder="Hours Worked"
          value={
            formData.hoursWorked
          }
          onChange={
            handleChange
          }
          className="w-full p-3 bg-slate-700 rounded mb-4"
        />

        <input
          type="number"
          name="progressPercentage"
          placeholder="Progress Percentage"
          value={
            formData.progressPercentage
          }
          onChange={
            handleChange
          }
          className="w-full p-3 bg-slate-700 rounded mb-4"
        />

        <button
          className="bg-yellow-500 text-black px-5 py-3 rounded font-bold"
        >
          Submit Report
        </button>

      </form>

      <div className="grid gap-5">

        {reports.map(
          (report) => (

            <div
              key={
                report._id
              }
              className="bg-slate-800 p-6 rounded-xl"
            >

              <h2 className="text-xl font-bold">
                {
                  report.task
                    ?.title
                }
              </h2>

              <p className="mt-3">
                {
                  report.workDescription
                }
              </p>

              <p className="mt-2">
                Hours:
                {" "}
                {
                  report.hoursWorked
                }
              </p>

              <p className="mt-2">
                Progress:
                {" "}
                {
                  report.progressPercentage
                }
                %
              </p>

            </div>

          )
        )}

      </div>

    </div>
  );
};

export default MyReports;