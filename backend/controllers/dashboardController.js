const Company = require("../models/Company");
const User = require("../models/User");
const Task = require("../models/Task");
const Attendance = require("../models/Attendance");
const WorkReport = require("../models/WorkReport");


exports.getDashboardStats = async (
  req,
  res
) => {
  try {

    const totalCompanies =
      await Company.countDocuments({
        isActive: true
      });

    const totalEmployees =
      await User.countDocuments({
        role: "EMPLOYEE",
        isActive: true
      });

    const totalAdmins =
      await User.countDocuments({
        role: "COMPANY_ADMIN"
      });

    const totalTeamLeads =
      await User.countDocuments({
        role: "TEAM_LEAD"
      });

    const activeTasks =
      await Task.countDocuments({
        status: {
          $in: [
            "PENDING",
            "IN_PROGRESS"
          ]
        }
      });

    const completedTasks =
      await Task.countDocuments({
        status: "COMPLETED"
      });

    const pendingTasks =
      await Task.countDocuments({
        status: {
          $in: [
            "PENDING",
            "IN_PROGRESS"
          ]
        }
      });

    const reportsToday =
      await WorkReport.countDocuments({
        createdAt: {
          $gte: new Date(
            new Date().setHours(
              0,
              0,
              0,
              0
            )
          )
        }
      });

    res.json({
      success: true,

      totalCompanies,

      totalEmployees,

      totalAdmins,

      totalTeamLeads,

      activeTasks,

      completedTasks,

      pendingTasks,

      reportsToday
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.companySummary =
  async (req, res) => {

    try {

      const companies =
        await Company.aggregate([
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField:
                "company",
              as: "employees"
            }
          },
          {
            $project: {
              name: 1,
              employeeCount:
              {
                $size:
                  "$employees"
              }
            }
          }
        ]);

      res.json(companies);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };


exports.topEmployees =
  async (req, res) => {

    try {

      const employees =
        await WorkReport.aggregate([
          {
            $group: {
              _id:
                "$employee",

              totalHours: {
                $sum:
                  "$hoursWorked"
              }
            }
          },

          {
            $sort: {
              totalHours: -1
            }
          },

          {
            $limit: 10
          }
        ]);

      res.json(employees);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };


exports.attendanceSummary =
  async (req, res) => {

    try {

      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const present =
        await Attendance.countDocuments({
          date: today
        });

      const employees =
        await User.countDocuments({
          role: "EMPLOYEE"
        });

      const percentage =
        (
          (present /
            employees) *
          100
        ).toFixed(2);

      res.json({
        present,
        employees,
        percentage
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };

exports.employeeDashboard =
  async (req, res) => {

    try {

      const assignedTasks =
        await Task.countDocuments({
          assignedTo:
            req.user.id
        });

      const pendingTasks =
        await Task.countDocuments({
          assignedTo: req.user.id,
          status: {
            $in: [
              "PENDING",
              "IN_PROGRESS"
            ]
          }
        });

      const completedTasks =
        await Task.countDocuments({
          assignedTo:
            req.user.id,
          status:
            "COMPLETED"
        });

      const reportsSubmitted =
        await WorkReport.countDocuments({
          employee:
            req.user.id
        });

      const attendanceDays =
        await Attendance.countDocuments({
          employee:
            req.user.id
        });

      res.json({
        success: true,
        assignedTasks,
        pendingTasks,
        completedTasks,
        reportsSubmitted,
        attendanceDays
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  };


exports.companyAdminDashboard =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );

      const companyId =
        user.company;

      const totalEmployees =
        await User.countDocuments({
          company:
            companyId,
          role:
            "EMPLOYEE",
        });

      const activeTasks =
        await Task.countDocuments({
          company:
            companyId,
          status: {
            $in: [
              "PENDING",
              "IN_PROGRESS",
            ],
          },
        });

      const selfAssignedTasks =
        await Task.countDocuments({
          company: companyId,
          isSelfAssigned: true,
          status: {
            $in: [
              "PENDING",
              "IN_PROGRESS"
            ]
          }
        });

      const pendingTasks =
        await Task.countDocuments({
          company: companyId,
          status: "PENDING",
        });

      const completedTasks =
        await Task.countDocuments({
          company:
            companyId,
          status:
            "COMPLETED",
        });

      const reportsSubmitted =
        await WorkReport.countDocuments({
          company:
            companyId,
        });

      const attendanceToday =
        await Attendance.countDocuments({
          company:
            companyId,
          date: {
            $gte:
              new Date(
                new Date().setHours(
                  0,
                  0,
                  0,
                  0
                )
              ),
          },
        });

      res.json({
        success: true,
        totalEmployees,
        activeTasks,
        pendingTasks,
        completedTasks,
        reportsSubmitted,
        attendanceToday,
        selfAssignedTasks
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };


exports.getTasksByFilter =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );

      const filter = {
        company:
          user.company
      };

      if (
        req.query.type ===
        "employees"
      ) {

        const employees =
          await User.find({
            company: user.company,
            role: "EMPLOYEE"
          });

        return res.json({
          success: true,
          employees
        });
      }

      if (
        req.query.type ===
        "pending"
      ) {
        filter.status = {
          $in: [
            "PENDING",
            "IN_PROGRESS"
          ]
        };
      }

      if (
        req.query.type ===
        "completed"
      ) {
        filter.status =
          "COMPLETED";
      }

      if (
        req.query.type ===
        "self"
      ) {
        filter.isSelfAssigned =
          true;
      }

      const tasks =
        await Task.find(filter)
          .populate(
            "assignedTo",
            "fullName"
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