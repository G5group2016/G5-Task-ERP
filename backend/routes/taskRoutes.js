const express =
  require("express");

const router =
  express.Router();

const auth =
  require("../middleware/authMiddleware");

const role =
  require("../middleware/roleMiddleware");

const {
  createTask,
  getTasks,
  getMyTasks,
  updateStatus, getLatestTasks, createSelfTask
} = require(
  "../controllers/taskController"
);

router.post(
  "/",
  auth,
  role(
    "SUPER_ADMIN",
    "COMPANY_ADMIN"
  ),
  createTask
);

router.get(
  "/",
  auth,
  role(
    "SUPER_ADMIN",
    "COMPANY_ADMIN",
    "OFFICE_MANAGER"
  ),
  getTasks
);

router.get(
  "/latest",
  auth,
  role(
    "SUPER_ADMIN",
    "COMPANY_ADMIN",
    "OFFICE_MANAGER"
  ),
  getLatestTasks
);

router.get(
  "/my",
  auth,
  getMyTasks
);

router.put(
  "/status/:id",
  auth,
  updateStatus
);

router.post(
  "/self",
  auth,
  role(
    "EMPLOYEE",
    "TEAM_LEAD"
  ),
  createSelfTask
);

module.exports =
  router;