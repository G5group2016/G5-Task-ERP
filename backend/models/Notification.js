const mongoose = require("mongoose");

const notificationSchema =
    new mongoose.Schema(
        {

            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null
            },
            title: String,

            message: String,

            isRead: {
                type: Boolean,
                default: false
            },

            type: {
                type: String,
                default: "NEW_EMPLOYEE"
            },

            company: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Company"
            },

            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    );

module.exports =
    mongoose.model(
        "Notification",
        notificationSchema
    );