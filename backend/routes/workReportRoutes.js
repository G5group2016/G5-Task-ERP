const express =
require("express");

const router =
express.Router();

const auth =
require("../middleware/authMiddleware");

const role =
require("../middleware/roleMiddleware");

const {
  submitReport,
  getMyReports,
  getAllReports
} = require(
  "../controllers/workReportController"
);

router.post(
  "/",
  auth,
  role(
    "EMPLOYEE",
    "TEAM_LEAD",
    "COMPANY_ADMIN"
  ),
  submitReport
);

router.get(
  "/my",
  auth,
  getMyReports
);

router.get(
  "/",
  auth,
  role(
    "SUPER_ADMIN",
    "COMPANY_ADMIN"
  ),
  getAllReports
);

module.exports =
router;