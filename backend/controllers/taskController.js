const User =
  require("../models/User");

const Task =
  require("../models/Task");

const Notification =
  require("../models/Notification");
const XLSX = require("xlsx");

exports.createTask =
  async (req, res) => {
    try {


      const employee =
        await User.findById(
          req.body.assignedTo
        );

      const task =
        await Task.create({
          ...req.body,
          assignedBy: req.user.id,
          assignedToName:
            employee.fullName
        });

      const assignedBy =
        await User.findById(
          req.user.id
        );

      await Notification.create({

        user: employee._id,

        title:
          "New Task Assigned",

        message: `
Task: ${task.title}
Priority: ${task.priority}
Assigned By: ${assignedBy.fullName}
  `,

        type:
          "TASK_ASSIGNED"
      });



      res.status(201).json({
        success: true,
        task
      });

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };




exports.getTasks =
  async (req, res) => {

    try {

      let filter = {};

      if (
        req.user.role ===
        "COMPANY_ADMIN"
      ) {

        const currentUser =
          await User.findById(
            req.user.id
          );

        filter.company =
          currentUser.company;

      }

      // OFFICE_MANAGER can filter by selected company
      if (
        req.user.role === "OFFICE_MANAGER" &&
        req.query.company
      ) {
        filter.company = req.query.company;
      }

      const tasks =
        await Task.find(
          filter
        )
          .populate(
            "assignedTo",
            "fullName email"
          )
          .populate(
            "company",
            "name"
          )
          .sort({
            createdAt: -1
          });

      res.json({
        success: true,
        tasks
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  };

exports.getMyTasks =
  async (req, res) => {

    try {

      const tasks =
        await Task.find({
          assignedTo: req.user.id
        })
          .populate(
            "company",
            "name"
          )
          .populate(
            "assignedBy",
            "fullName"
          )
          .sort({
            createdAt: -1
          });

      res.json(tasks);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };


exports.updateStatus =
  async (req, res) => {

    try {

      const task =
        await Task.findById(
          req.params.id
        );

      if (!task) {

        return res
          .status(404)
          .json({
            message:
              "Task not found"
          });

      }

      if (
        task.assignedTo.toString() !==
        req.user.id
      ) {

        return res
          .status(403)
          .json({
            message:
              "Not Allowed"
          });

      }

      task.status =
        req.body.status;

      if (req.body.status === "COMPLETED") {

        task.completionDate = new Date();

        const employee =
          await User.findById(req.user.id);

        const managers =
          await User.find({
            $or: [
              {
                company: employee.company,
                role: "COMPANY_ADMIN"
              },
              {
                role: "SUPER_ADMIN"
              }
            ]
          });

        for (const manager of managers) {

          await Notification.create({
            user: manager._id,
            title: "✅ Task Completed",
            message: `${employee.fullName} completed "${task.title}"`,
            type: "TASK_COMPLETED"
          });

        }

      }

      await task.save();

      res.json({
        success: true,
        task,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

exports.getLatestTasks =
  async (req, res) => {

    try {

      let filter = {};

      if (
        req.user.role ===
        "COMPANY_ADMIN"
      ) {

        const currentUser =
          await User.findById(
            req.user.id
          );

        filter.company =
          currentUser.company;

      }

      const tasks =
        await Task.find(filter)
          .populate(
            "assignedTo",
            "fullName"
          )
          .sort({
            createdAt: -1
          })
          .limit(10);

      res.json({
        success: true,
        tasks
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }

  };


exports.createSelfTask = async (req, res) => {
  try {

    const currentUser =
      await User.findById(req.user.id);

    const task =
      await Task.create({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,

        company: currentUser.company,

        assignedTo: currentUser._id,
        assignedToName: currentUser.fullName,

        assignedBy: currentUser._id,
        createdBy: currentUser._id,

        isSelfAssigned: true
      });

    const managers =
      await User.find({
        $or: [
          {
            company: currentUser.company,
            role: "COMPANY_ADMIN"
          },
          {
            role: "SUPER_ADMIN"
          }
        ]
      });

    for (const manager of managers) {

      await Notification.create({

        user: manager._id,

        title:
          "✅ Employee Started Work",

        message: `
Employee: ${currentUser.fullName}
Task: ${task.title}
Priority: ${task.priority}
`,

        type: "SELF_TASK"
      });

    }

    res.status(201).json({
      success: true,
      task
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.exportTasksExcel = async (req, res) => {
  try {
    let filter = {};

    if (req.query.company) {
      filter.company = req.query.company;
    }

    if (req.user.role === "COMPANY_ADMIN") {
      const currentUser = await User.findById(req.user.id);
      filter.company = currentUser.company;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "fullName email")
      .populate("company", "name")
      .sort({ createdAt: -1 });

    const excelData = tasks.map((task) => ({
      Employee:
        task.assignedTo?.fullName ||
        task.assignedToName,

      Email:
        task.assignedTo?.email || "-",

      Company:
        task.company?.name || "-",

      Task:
        task.title,

      Description:
        task.description,

      Priority:
        task.priority,

      Status:
        task.status,

      SelfAssigned:
        task.isSelfAssigned
          ? "Yes"
          : "No",

      // StartDate:
      //   task.startDate
      //     ? new Date(task.startDate).toLocaleDateString()
      //     : "-",

      DueDate:
        task.dueDate
          ? new Date(task.dueDate).toLocaleDateString()
          : "-",

      CompletionDate:
        task.completionDate
          ? new Date(task.completionDate).toLocaleDateString()
          : "-",

      CreatedAt:
        new Date(task.createdAt).toLocaleDateString(),
    }));

    const workbook = XLSX.utils.book_new();

    const worksheet =
      XLSX.utils.json_to_sheet(excelData);

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Tasks"
    );

    const buffer = XLSX.write(
      workbook,
      {
        type: "buffer",
        bookType: "xlsx",
      }
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Tasks.xlsx"
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};