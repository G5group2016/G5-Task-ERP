const Notification =
  require("../models/Notification");
const Company =
  require("../models/Company");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
        role === "COMPANY_ADMIN"
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
        isActive: {
          $ne: false
        }
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
            "COMPANY_ADMIN"
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
          isActive: true
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
    try {
      await User.findByIdAndUpdate(
        req.params.id,
        {
          isActive: false
        }
      );

      res.json({
        message:
          "Employee deleted"
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };


// exports.getMyTeam = async (req, res) => {
//   try {

//     console.log("Logged In Team Lead:", req.user.id);

//     const employees = await User.find({
//       reportingManager: req.user.id
//     });

//     console.log("Employees Found:", employees);

//     res.json({
//       success: true,
//       employees
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: error.message
//     });
//   }
// };