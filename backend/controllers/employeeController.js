const Notification =
  require("../models/Notification");
const Company =
  require("../models/Company");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Task =
  require("../models/Task");

const Attendance =
  require("../models/Attendance");

const WorkReport =
  require("../models/WorkReport");

exports.createEmployee = async (
  req,
  res
) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      designation,
      department,
      role,
      company,
    } = req.body;

    if (
      req.user.role ===
      "COMPANY_ADMIN"
    ) {

      if (
        role === "SUPER_ADMIN" ||
        role === "COMPANY_ADMIN" ||
        role === "OFFICE_MANAGER"
      ) {

        return res.status(403).json({
          message:
            "You cannot create this role"
        });

      }

    }

    const existing =
      await User.findOne({
        email,
        isDeleted: false
      });

    if (existing) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    let companyId = company;

    if (
      role === "OFFICE_MANAGER"
    ) {
      companyId = null;
    }

    if (
      req.user.role ===
      "COMPANY_ADMIN"
    ) {

      const currentUser =
        await User.findById(
          req.user.id
        );

      companyId =
        currentUser.company;

    }

    const employee =
      await User.create({
        fullName,
        email,
        password:
          hashedPassword,
        phone,
        designation,
        department,
        role,
        company: companyId,
        joiningDate:
          new Date()
      });

    const companyData =
      await Company.findById(
        employee.company
      );

    await Notification.create({
      title: "New Employee Joined",

      message: `
Name: ${employee.fullName}
Designation: ${employee.designation}
Department: ${employee.department}
Role: ${employee.role}
`
    });

    res.status(201).json({
      success: true,
      employee
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


exports.getEmployees =
  async (req, res) => {

    try {

      let filter = {
        role: {
          $in: [
            "EMPLOYEE",
            "TEAM_LEAD",
            "COMPANY_ADMIN",
            "OFFICE_MANAGER"
          ]
        }
      };

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

      const employees =
        await User.find({
          ...filter,
          isDeleted: false
        })
          .populate(
            "company",
            "name code"
          )
          .select(
            "-password"
          );

      res.json({
        success: true,
        employees
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  };


exports.getEmployee =
  async (req, res) => {
    try {
      const employee =
        await User.findById(
          req.params.id
        )
          .populate(
            "company"
          )
          .select("-password");

      if (!employee) {
        return res.status(404).json({
          message:
            "Employee not found"
        });
      }

      res.json(employee);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };



exports.disableEmployee =
  async (req, res) => {

    const employee =
      await User.findById(
        req.params.id
      );

    if (
      employee.role ===
      "SUPER_ADMIN" ||
      employee.role ===
      "OFFICE_MANAGER"
    ) {

      return res.status(400).json({
        message:
          "This account cannot be deleted"
      });

    }

    await User.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
        isActive: false
      }
    );

    res.json({
      success: true,
      message: "Employee deleted"
    });

  };


exports.toggleEmployeeStatus =
  async (req, res) => {

    try {

      const employee =
        await User.findById(
          req.params.id
        );

      if (!employee) {

        return res.status(404).json({
          message:
            "Employee not found"
        });

      }

      if (
        employee.role === "SUPER_ADMIN" ||
        employee.role === "OFFICE_MANAGER"
      ) {

        return res.status(400).json({
          message:
            "Super Admin and Office Manager cannot be deactivated"
        });

      }

      if (
        req.user.id === employee._id.toString()
      ) {

        return res.status(400).json({
          message:
            "You cannot deactivate yourself"
        });

      }

      employee.isActive =
        !employee.isActive;

      await employee.save();

      res.json({
        success: true,
        employee
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }

  };


exports.getEmployeeTasks =
  async (req, res) => {

    try {

      const tasks =
        await Task.find({
          assignedTo:
            req.params.id
        })
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

exports.getEmployeeAttendance =
  async (req, res) => {

    try {

      const attendance =
        await Attendance.find({
          employee:
            req.params.id
        })
          .sort({
            date: -1
          });

      res.json({
        success: true,
        attendance
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }

  };


exports.getEmployeeReports =
  async (req, res) => {

    try {

      const reports =
        await WorkReport.find({
          employee:
            req.params.id
        })
          .populate(
            "task",
            "title"
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