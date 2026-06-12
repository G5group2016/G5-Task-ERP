const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      // unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: [
        "SUPER_ADMIN",
        "COMPANY_ADMIN",
        "TEAM_LEAD",
        "EMPLOYEE"
      ],
      default: "EMPLOYEE"
    },

    employeeId: {
      type: String,
      unique: true,
      sparse: true
    },

    designation: String,

    department: String,

    phone: String,

    profileImage: String,

    joiningDate: Date,

    reportingManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },


    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company"
    },

    isActive: {
      type: Boolean,
      default: true
    },
    
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isActive: true
    }
  }
);

module.exports = mongoose.model("User", userSchema);