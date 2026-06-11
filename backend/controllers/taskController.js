const User =
require("../models/User");

const Task =
  require("../models/Task");

exports.createTask =
  async (req, res) => {
    try {

      const task =
        await Task.create({
          ...req.body,
          assignedBy:
            req.user.id
        });

      res.status(201).json({
        success: true,
        task
      });

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };


exports.getTasks =
  async (req, res) => {

    try {

      let filter = {};

      if (
        req.user.role ===
        "COMPANY_ADMIN"
      ) {

        const currentUser =
          await User.findById(
            req.user.id
          );

        filter.company =
          currentUser.company;

      }

      const tasks =
        await Task.find(
          filter
        )
          .populate(
            "assignedTo",
            "fullName email"
          )
          .populate(
            "company",
            "name"
          )
          .sort({
            createdAt: -1
          });

      res.json({
        success: true,
        tasks
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  };

exports.getMyTasks =
  async (req, res) => {

    try {

      const tasks =
        await Task.find({
          assignedTo: req.user.id
        })
          .populate(
            "company",
            "name"
          )
          .populate(
            "assignedBy",
            "fullName"
          )
          .sort({
            createdAt: -1
          });

      res.json(tasks);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };


exports.updateStatus =
  async (req, res) => {

    try {

      const task =
        await Task.findById(
          req.params.id
        );

      if (!task) {

        return res
          .status(404)
          .json({
            message:
              "Task not found"
          });

      }

      if (
        task.assignedTo.toString() !==
        req.user.id
      ) {

        return res
          .status(403)
          .json({
            message:
              "Not Allowed"
          });

      }

      task.status =
        req.body.status;

      if (
        req.body.status ===
        "COMPLETED"
      ) {

        task.completionDate =
          new Date();

      }

      await task.save();

      res.json({
        success: true,
        task,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

