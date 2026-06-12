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
    uploadRequest,
    getRequests,
    approveRequest,
    rejectRequest, getMyRequest
} = require(
    "../controllers/profileImageRequestController"
);
const upload =
require("../middleware/upload");

router.post(
    "/",
    auth,
    upload.single("image"),
    uploadRequest
);

router.get(
    "/",
    auth,
    role(
        "SUPER_ADMIN",
        "COMPANY_ADMIN"
    ),
    getRequests
);

router.put(
    "/approve/:id",
    auth,
    role(
        "SUPER_ADMIN",
        "COMPANY_ADMIN"
    ),
    approveRequest
);

router.put(
    "/reject/:id",
    auth,
    role(
        "SUPER_ADMIN",
        "COMPANY_ADMIN"
    ),
    rejectRequest
);

router.get(
    "/my",
    auth,
    getMyRequest
);

module.exports =
    router;