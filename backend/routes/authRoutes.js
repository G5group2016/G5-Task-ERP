const express = require("express");

const router =
  express.Router();

const {
  registerSuperAdmin,
  login,  getProfile,
 updateProfile,
 uploadProfileImage, changePassword
} = require(
  "../controllers/authController"
);

const auth =
require(
 "../middleware/authMiddleware"
);

const upload =
require(
 "../middleware/upload"
);

router.post(
  "/register-super-admin",
  registerSuperAdmin
);

router.post("/login", login);

router.get(
 "/me",
 auth,
 getProfile
);

router.put(
 "/profile",
 auth,
 updateProfile
);

router.post(
 "/profile-image",
 auth,
 upload.single("image"),
 uploadProfileImage
);

router.put(
  "/change-password",
  auth,
  changePassword
);

module.exports = router;