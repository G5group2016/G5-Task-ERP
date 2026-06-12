const express =
  require("express");

const router =
  express.Router();

const auth =
  require(
    "../middleware/authMiddleware"
  );

  const role =
  require(
    "../middleware/roleMiddleware"
  );

const {
  getNotifications,
  markAllAsRead, deleteNotification,
  deleteAllNotifications
} = require(
  "../controllers/notificationController"
);

router.get(
  "/",
  auth,
  getNotifications
);

router.put(
  "/read-all",
  auth,
  markAllAsRead
);

router.delete(
  "/:id",
  auth,
  role(
    "SUPER_ADMIN",
    "COMPANY_ADMIN"
  ),
  deleteNotification
);

router.delete(
  "/",
  auth,
  role(
    "SUPER_ADMIN",
    "COMPANY_ADMIN"
  ),
  deleteAllNotifications
);

module.exports =
  router;