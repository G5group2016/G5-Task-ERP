const Chat =
  require("../models/Chat");

const Message =
  require("../models/Message");

const User =
  require("../models/User");

/* ==========================
   Search Users
========================== */

exports.searchUsers =
  async (req, res) => {

    try {

      const search =
        req.query.search || "";

      const users =
        await User.find({

          _id: {
            $ne: req.user.id
          },

          fullName: {
            $regex: search,
            $options: "i"
          },

          isDeleted: false

        })
          .populate(
            "company",
            "name"
          )
          .select(
            "fullName email role company profileImage"
          )
          .limit(20);

      res.json({
        success: true,
        users
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  };

/* ==========================
   Create Chat
========================== */

exports.createChat =
  async (req, res) => {

    try {

      const {
        userId
      } = req.body;

      let chat =
        await Chat.findOne({

          users: {
            $all: [
              req.user.id,
              userId
            ]
          }

        })
          .populate(
            "users",
            "fullName email profileImage company"
          );

      if (chat) {

        return res.json({
          success: true,
          chat
        });

      }

      chat =
        await Chat.create({

          users: [
            req.user.id,
            userId
          ]

        });

      chat =
        await Chat.findById(
          chat._id
        )
          .populate({
            path: "users",
            populate: {
              path: "company",
              select: "name"
            }
          });

      res.json({
        success: true,
        chat
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  };

/* ==========================
   My Chats
========================== */

exports.getMyChats =
  async (req, res) => {

    try {

      const chats =
        await Chat.find({

          users:
            req.user.id

        })
          .populate({
            path: "users",
            populate: {
              path: "company",
              select: "name"
            }
          })
          .sort({
            updatedAt: -1
          });

      res.json({
        success: true,
        chats
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  };

/* ==========================
   Get Messages
========================== */

exports.getMessages =
  async (req, res) => {

    try {
      await Message.updateMany(
        {
          chat: req.params.chatId,

          sender: {
            $ne: req.user.id
          },

          isRead: false
        },
        {
          isRead: true
        }
      );

      const messages =
        await Message.find({

          chat:
            req.params.chatId

        })
          .populate(
            "sender",
            "fullName profileImage"
          )
          .sort({
            createdAt: 1
          });

      res.json({
        success: true,
        messages
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  };

/* ==========================
   Send Message
========================== */

exports.sendMessage =
  async (req, res) => {

    try {

      const message =
        await Message.create({

          chat:
            req.params.chatId,

          sender:
            req.user.id,

          content:
            req.body.content

        });

      await Chat.findByIdAndUpdate(
        req.params.chatId,
        {
          updatedAt:
            new Date()
        }
      );

      res.json({
        success: true,
        message
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  };

exports.getUnreadCounts =
  async (req, res) => {

    try {

      const chats =
        await Chat.find({
          users: req.user.id
        });

      const counts = {};

      for (const chat of chats) {

        const count =
          await Message.countDocuments({

            chat: chat._id,

            sender: {
              $ne: req.user.id
            },

            isRead: false
          });

        counts[chat._id] =
          count;
      }

      res.json({
        success: true,
        counts
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };