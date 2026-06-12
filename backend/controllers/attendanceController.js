const Attendance =
  require("../models/Attendance");

const User =
  require("../models/User");


exports.checkIn =
  async (req, res) => {

    try {

      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const existing =
        await Attendance.findOne({
          employee:
            req.user.id,
          date: today
        });

      if (existing) {
        return res.status(400).json({
          message:
            "Already checked in today"
        });
      }

      const user =
        await User.findById(
          req.user.id
        );

      const now =
        new Date();

      const lateHour = 9;

      const status =
        now.getHours() >=
          lateHour
          ? "LATE"
          : "PRESENT";

      const attendance =
        await Attendance.create({
          employee: req.user.id,
          employeeName:
            user.fullName,
          company: user.company,
          date: today,
          checkIn: now,
          status
        });

      res.status(201).json({
        success: true,
        attendance
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };



exports.checkOut =
  async (req, res) => {

    try {

      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const attendance =
        await Attendance.findOne({
          employee:
            req.user.id,
          date: today
        });

      if (!attendance) {

        return res.status(404).json({
          message:
            "Check-in first"
        });

      }

      if (
        attendance.checkOut
      ) {

        return res.status(400).json({
          message:
            "Already checked out"
        });

      }

      attendance.checkOut =
        new Date();

      const totalHours =
        (
          attendance.checkOut -
          attendance.checkIn
        ) /
        (1000 * 60 * 60);

      attendance.totalHours =
        totalHours.toFixed(2);

      await attendance.save();

      res.json({
        success: true,
        attendance
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };



exports.myAttendance =
  async (req, res) => {

    try {

      const records =
        await Attendance.find({
          employee:
            req.user.id
        }).sort({
          createdAt: -1
        });

      res.json(records);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  };


exports.getAllAttendance =
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

      const records =
        await Attendance.find(
          filter
        )
          .populate(
            "employee",
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
        records
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  };