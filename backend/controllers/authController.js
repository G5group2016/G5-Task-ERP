const User = require("../models/User");
const bcrypt = require("bcryptjs");
const ProfileImageRequest =
  require(
    "../models/ProfileImageRequest"
  );

const Notification =
  require(
    "../models/Notification"
  );

const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/generateToken");

exports.registerSuperAdmin = async (req, res) => {
  try {
    const existingAdmin =
      await User.findOne({
        role: "SUPER_ADMIN"
      });

    if (existingAdmin) {
      return res.status(400).json({
        message:
          "Super Admin already exists"
      });
    }

    const {
      fullName,
      email,
      password
    } = req.body;

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const admin = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "SUPER_ADMIN"
    });

    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    res.json({
      accessToken,
      refreshToken,
      user
    });
  } catch (error) {
    res.status(500).json(error);
  }
};


exports.getProfile =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        )
          .populate(
            "company",
            "name"
          )
          .select("-password");

      res.json(user);

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  };

exports.updateProfile =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {

        return res
          .status(404)
          .json({
            message:
              "User not found"
          });

      }

      user.fullName =
        req.body.fullName ||
        user.fullName;

      user.phone =
        req.body.phone ||
        user.phone;

      user.designation =
        req.body.designation ||
        user.designation;

      user.department =
        req.body.department ||
        user.department;

      await user.save();

      res.json({
        success: true,
        user
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  };

exports.uploadProfileImage =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {

        return res
          .status(404)
          .json({
            message:
              "User not found"
          });

      }

      const existingRequest =
        await ProfileImageRequest.findOne({
          employee: user._id,
          status: "PENDING"
        });

      if (existingRequest) {

        return res.status(400).json({
          message:
            "You already have a pending profile image request"
        });

      }

      await ProfileImageRequest.create({

        employee:
          user._id,

        company:
          user.company,

        imageUrl:
          req.file.path
      });

      await Notification.create({

        title:
          "Profile Image Approval Request",

        message: `
Employee: ${user.fullName}
Requested profile image approval
`
      });

      res.json({
        success: true,
        message:
          "Profile image sent for approval"
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  };


exports.changePassword =
  async (req, res) => {

    try {

      const {
        currentPassword,
        newPassword
      } = req.body;

      const user =
        await User.findById(
          req.user.id
        );

      const isMatch =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!isMatch) {

        return res
          .status(400)
          .json({
            message:
              "Current password is incorrect"
          });

      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          12
        );

      user.password =
        hashedPassword;

      await user.save();

      res.json({
        success: true,
        message:
          "Password changed successfully"
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  };