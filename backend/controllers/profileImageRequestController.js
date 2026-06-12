const User =
    require("../models/User");

const Notification =
    require("../models/Notification");

const ProfileImageRequest =
    require(
        "../models/ProfileImageRequest"
    );

exports.uploadRequest =
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.user.id
                );

            const existingRequest =
                await ProfileImageRequest.findOne({
                    employee: req.user.id,
                    status: "PENDING"
                });

            if (existingRequest) {

                return res.status(400).json({
                    message:
                        "You already have a pending profile image request"
                });

            }

            const request =
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
                request
            });

        } catch (error) {

            res.status(500).json({
                message:
                    error.message
            });

        }
    };

exports.getRequests =
    async (req, res) => {

        try {

            let filter = {};

            if (
                req.user.role ===
                "COMPANY_ADMIN"
            ) {

                const admin =
                    await User.findById(
                        req.user.id
                    );

                filter.company =
                    admin.company;
            }

            const requests =
                await ProfileImageRequest
                    .find({ ...filter, status: "PENDING" })
                    .populate(
                        "employee",
                        "fullName email designation"
                    )
                    .sort({
                        createdAt: -1
                    });

            res.json({
                success: true,
                requests
            });

        } catch (error) {

            res.status(500).json({
                message:
                    error.message
            });

        }
    };


exports.approveRequest =
    async (req, res) => {

        try {

            const request =
                await ProfileImageRequest.findById(
                    req.params.id
                );

            if (!request) {

                return res.status(404).json({
                    message:
                        "Request not found"
                });

            }

            if (
                request.status !== "PENDING"
            ) {

                return res.status(400).json({
                    message:
                        "Request already reviewed"
                });

            }

            await User.findByIdAndUpdate(
                request.employee,
                {
                    profileImage:
                        request.imageUrl
                }
            );

            request.status =
                "APPROVED";

            request.reviewedBy =
                req.user.id;

            request.reviewedAt =
                new Date();

            await request.save();

            const employee =
                await User.findById(
                    request.employee
                );

            await Notification.create({

                title:
                    "Profile Image Approved",

                message:
                    `${employee.fullName}'s profile image approved`

            });

            res.json({
                success: true
            });

        } catch (error) {

            res.status(500).json({
                message:
                    error.message
            });

        }
    };

exports.rejectRequest =
    async (req, res) => {

        try {

            const request =
                await ProfileImageRequest.findById(
                    req.params.id
                );

            if (!request) {

                return res.status(404).json({
                    message: "Request not found"
                });

            }

            if (
                request.status !== "PENDING"
            ) {

                return res.status(400).json({
                    message:
                        "Request already reviewed"
                });

            }

            request.status =
                "REJECTED";

            request.reviewedBy =
                req.user.id;

            request.reviewedAt =
                new Date();

            await request.save();

            const employee =
                await User.findById(
                    request.employee
                );

            await Notification.create({

                title:
                    "Profile Image Rejected",

                message:
                    `${employee.fullName}'s profile image rejected`

            });

            res.json({
                success: true
            });

        } catch (error) {

            res.status(500).json({
                message:
                    error.message
            });

        }
    };

exports.getMyRequest =
    async (req, res) => {

        try {

            const request =
                await ProfileImageRequest
                    .findOne({
                        employee:
                            req.user.id
                    })
                    .sort({
                        createdAt: -1
                    });

            res.json({
                success: true,
                request
            });

        } catch (error) {

            res.status(500).json({
                message:
                    error.message
            });

        }
    };