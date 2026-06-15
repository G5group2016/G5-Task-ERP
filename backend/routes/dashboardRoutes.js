const express =
require("express");

const router =
express.Router();

const auth =
require("../middleware/authMiddleware");

const role =
require("../middleware/roleMiddleware");

const {
  getDashboardStats,
  companySummary,
  topEmployees,
  attendanceSummary,employeeDashboard, companyAdminDashboard
} = require(
 "../controllers/dashboardController"
);

router.get(
 "/stats",
 auth,
 role("SUPER_ADMIN","OFFICE_MANAGER"),
 getDashboardStats
);

router.get(
 "/companies",
 auth,
 role("SUPER_ADMIN"),
 companySummary
);

router.get(
 "/top-employees",
 auth,
 role("SUPER_ADMIN"),
 topEmployees
);

router.get(
 "/attendance",
 auth,
 role("SUPER_ADMIN"),
 attendanceSummary
);

router.get(
  "/employee",
  auth,
  role(
    "EMPLOYEE",
    "TEAM_LEAD"
  ),
  employeeDashboard
);

router.get(
  "/company-admin",
  auth,
  role(
    "COMPANY_ADMIN",
    "OFFICE_MANAGER"
  ),
  companyAdminDashboard
);

module.exports =
router;