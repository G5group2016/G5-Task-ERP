const express =
  require("express");

const router =
  express.Router();

const auth =
  require("../middleware/authMiddleware");

const role =
  require("../middleware/roleMiddleware");

const {
  checkIn,
  checkOut,
  myAttendance,
  getAllAttendance
} = require(
  "../controllers/attendanceController"
);

router.post(
  "/check-in",
  auth,
  role(
    "EMPLOYEE",
    "TEAM_LEAD",
    "COMPANY_ADMIN"
  ),
  checkIn
);

router.post(
  "/check-out",
  auth,
  role(
    "EMPLOYEE",
    "TEAM_LEAD",
    "COMPANY_ADMIN"
  ),
  checkOut
);

router.get(
  "/my",
  auth,
  myAttendance
);

router.get(
  "/",
  auth,
  role(
    "SUPER_ADMIN",
    "OFFICE_MANAGER",
    "COMPANY_ADMIN"
  ),
  getAllAttendance
);

module.exports =
  router;