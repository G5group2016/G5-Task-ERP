const express =
  require("express");

const router =
  express.Router();

const auth =
  require(
    "../middleware/authMiddleware"
  );

const {
  getNotifications,
  markAllAsRead
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

module.exports =
  router;