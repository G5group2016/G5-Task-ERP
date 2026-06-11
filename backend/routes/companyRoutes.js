const express = require("express");

const router =
  express.Router();

const auth =
  require("../middleware/authMiddleware");

const role =
  require("../middleware/roleMiddleware");

const {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany
} = require(
  "../controllers/companyController"
);

router.post(
  "/",
  auth,
  role("SUPER_ADMIN"),
  createCompany
);

router.get(
  "/",
  auth,
  role("SUPER_ADMIN"),
  getCompanies
);

router.get(
  "/:id",
  auth,
  role("SUPER_ADMIN"),
  getCompany
);

router.put(
  "/:id",
  auth,
  role("SUPER_ADMIN"),
  updateCompany
);

router.delete(
  "/:id",
  auth,
  role("SUPER_ADMIN"),
  deleteCompany
);

module.exports = router;