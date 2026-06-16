const express =
  require("express");

const router =
  express.Router();

const auth =
  require("../middleware/authMiddleware");

const {
  searchUsers,
  createChat,
  getMyChats,
  getMessages,
  sendMessage, getUnreadCounts
} = require(
  "../controllers/chatController"
);

router.get(
  "/users/search",
  auth,
  searchUsers
);

router.post(
  "/",
  auth,
  createChat
);

router.get(
  "/",
  auth,
  getMyChats
);

router.get(
  "/messages/:chatId",
  auth,
  getMessages
);

router.post(
  "/messages/:chatId",
  auth,
  sendMessage
);

router.get(
  "/unread-counts",
  auth,
  getUnreadCounts
);

module.exports =
  router;