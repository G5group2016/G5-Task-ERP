const express = require("express");

const router =
  express.Router();

const auth =
  require("../middleware/authMiddleware");

const role =
  require("../middleware/roleMiddleware");

const upload =
  require("../middleware/upload");

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
  upload.single("logo"),
  createCompany
);

router.get(
  "/",
  auth,
  role("SUPER_ADMIN","OFFICE_MANAGER"),
  getCompanies
);

router.get(
  "/:id",
  auth,
  role("SUPER_ADMIN","OFFICE_MANAGER"),
  getCompany
);

router.put(
  "/:id",
  auth,
  role(
    "SUPER_ADMIN",
    "COMPANY_ADMIN"
  ),
  upload.single("logo"),
  updateCompany
);

router.delete(
  "/:id",
  auth,
  role("SUPER_ADMIN"),
  deleteCompany
);

module.exports = router;