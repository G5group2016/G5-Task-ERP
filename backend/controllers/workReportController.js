const User =
require("../models/User");
const XLSX = require("xlsx");
const WorkReport =
  require("../models/WorkReport");

const Task =
  require("../models/Task");

/* =====================================
   Submit Report
===================================== */

exports.submitReport =
  async (req, res) => {

    try {

      const task =
        await Task.findById(
          req.body.task
        );

      if (!task) {

        return res
          .status(404)
          .json({
            message:
              "Task not found",
          });

      }

      const existingReport =
        await WorkReport.findOne({
          employee:
            req.user.id,
          task:
            req.body.task,
        });

      if (existingReport) {

        return res
          .status(400)
          .json({
            message:
              "Report already submitted for this task",
          });

      }

      const report =
        await WorkReport.create({

          employee:
            req.user.id,

          company:
            task.company,

          task:
            req.body.task,

          workDescription:
            req.body.workDescription,

          hoursWorked:
            req.body.hoursWorked,

          progressPercentage:
            req.body.progressPercentage,

        });

      return res
        .status(201)
        .json({
          success: true,
          report,
        });

    } catch (error) {

      console.log(error);

      return res
        .status(500)
        .json({
          message:
            error.message,
        });

    }
  };

/* =====================================
   My Reports
===================================== */

exports.getMyReports =
  async (req, res) => {

    try {

      const reports =
        await WorkReport.find({
          employee:
            req.user.id,
        })
          .populate(
            "task",
            "title status"
          )
          .sort({
            createdAt: -1,
          });

      return res.json(
        reports
      );

    } catch (error) {

      console.log(error);

      return res
        .status(500)
        .json({
          message:
            error.message,
        });

    }
  };

/* =====================================
   All Reports
===================================== */
exports.getAllReports =
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

    const reports =
      await WorkReport.find(
        filter
      )
      .populate(
        "employee",
        "fullName email"
      )
      .populate(
        "company",
        "name"
      )
      .populate(
        "task",
        "title status"
      )
      .sort({
        createdAt: -1
      });

    res.json({
      success: true,
      reports
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }
};



exports.exportReportsExcel =
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

      const reports =
        await WorkReport.find(
          filter
        )
          .populate(
            "employee",
            "fullName email"
          )
          .populate(
            "company",
            "name"
          )
          .populate(
            "task",
            "title status"
          )
          .sort({
            createdAt: -1
          });

      const excelData =
        reports.map(
          (report) => ({
            Employee:
              report.employee
                ?.fullName,

            Email:
              report.employee
                ?.email,

            Company:
              report.company
                ?.name,

            Task:
              report.task
                ?.title,

            TaskStatus:
              report.task
                ?.status,

            HoursWorked:
              report.hoursWorked,

            Progress:
              `${report.progressPercentage}%`,

            WorkDescription:
              report.workDescription,

            ReportDate:
              new Date(
                report.reportDate
              ).toLocaleDateString(),
          })
        );

      const workbook =
        XLSX.utils.book_new();

      const worksheet =
        XLSX.utils.json_to_sheet(
          excelData
        );

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Reports"
      );

      const buffer =
        XLSX.write(
          workbook,
          {
            type: "buffer",
            bookType: "xlsx",
          }
        );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Reports.xlsx"
      );

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.send(buffer);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };