const express =
  require("express");

const router =
  express.Router();

const auth =
  require("../middleware/authMiddleware");

const role =
  require("../middleware/roleMiddleware");

const {
  createEmployee,
  getEmployees,
  getEmployee,
  disableEmployee,
  toggleEmployeeStatus,
  getEmployeeTasks,
  getEmployeeAttendance,
  getEmployeeReports
} = require(
  "../controllers/employeeController"
);

router.post(
  "/",
  auth,
  role(
    "SUPER_ADMIN",
    "COMPANY_ADMIN"
  ),
  createEmployee
);

router.get(
  "/",
  auth,
  role(
    "SUPER_ADMIN",
    "COMPANY_ADMIN",
    "OFFICE_MANAGER"
  ),
  getEmployees
);

// router.get(
//   "/my-team",
//   auth,
//   role("TEAM_LEAD"),
//   getMyTeam
// );

router.get(
  "/:id",
  auth,
  role(
    "SUPER_ADMIN",
    "OFFICE_MANAGER",
    "COMPANY_ADMIN"
  ),
  getEmployee
);

router.put(
  "/disable/:id",
  auth,
  role(
    "SUPER_ADMIN",
    "COMPANY_ADMIN"
  ),
  disableEmployee
);

router.put(
  "/status/:id",
  auth,
  role("SUPER_ADMIN"),
  toggleEmployeeStatus
);

router.get(
  "/:id/tasks",
  auth,
  role(
    "SUPER_ADMIN",
    "OFFICE_MANAGER",
    "COMPANY_ADMIN"
  ),
  getEmployeeTasks
);

router.get(
  "/:id/attendance",
  auth,
  role(
    "SUPER_ADMIN",
    "OFFICE_MANAGER",
    "COMPANY_ADMIN"
  ),
  getEmployeeAttendance
);

router.get(
  "/:id/reports",
  auth,
  role(
    "SUPER_ADMIN",
    "OFFICE_MANAGER",
    "COMPANY_ADMIN"
  ),
  getEmployeeReports
);


module.exports =
  router;