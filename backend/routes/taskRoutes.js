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
  updateStatus
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
  "/my",
  auth,
  getMyTasks
);

router.put(
  "/status/:id",
  auth,
  updateStatus
);

module.exports =
router;