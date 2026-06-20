const mongoose = require("mongoose");

const workReportSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true
    },

    workDescription: {
      type: String,
      required: true
    },

    hoursWorked: {
      type: Number,
      // required: true
    },

    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    attachments: [
      {
        type: String
      }
    ],

    reportDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports =
mongoose.model(
  "WorkReport",
  workReportSchema
);