const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
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

    date: {
      type: Date,
      required: true
    },

    checkIn: {
      type: Date
    },

    checkOut: {
      type: Date
    },

    totalHours: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: [
        "PRESENT",
        "ABSENT",
        "LATE"
      ],
      default: "PRESENT"
    }
  },
  {
    timestamps: true
  }
);

module.exports =
mongoose.model(
  "Attendance",
  attendanceSchema
);