const mongoose = require("mongoose");

const profileAuditSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      field: {
        type: String,
        required: true
      },

      oldValue: {
        type: String,
        default: ""
      },

      newValue: {
        type: String,
        default: ""
      },

      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    },
    {
      timestamps: true
    }
  );

module.exports =
  mongoose.model(
    "ProfileAudit",
    profileAuditSchema
  );