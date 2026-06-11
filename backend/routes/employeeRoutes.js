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
  disableEmployee
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
    "COMPANY_ADMIN"
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


module.exports =
  router;