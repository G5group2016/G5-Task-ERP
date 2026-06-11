const mongoose = require("mongoose");

const notificationSchema =
    new mongoose.Schema(
        {
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