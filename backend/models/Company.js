const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // unique: true,
      trim: true
    },

    code: {
      type: String,
      required: true,
      // unique: true,
      uppercase: true
    },

    email: String,

    phone: String,

    address: String,

    logo: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

companySchema.index(
  { name: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isActive: true
    }
  }
);

companySchema.index(
  { code: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isActive: true
    }
  }
);

module.exports = mongoose.model(
  "Company",
  companySchema
);