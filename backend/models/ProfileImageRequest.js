const mongoose =
  require("mongoose");

const profileImageRequestSchema =
  new mongoose.Schema(
    {
      employee: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      company: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Company"
      },

      imageUrl: String,

      status: {
        type: String,
        enum: [
          "PENDING",
          "APPROVED",
          "REJECTED"
        ],
        default: "PENDING"
      },

      reviewedBy: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      reviewedAt: Date
    },
    {
      timestamps: true
    }
  );

module.exports =
  mongoose.model(
    "ProfileImageRequest",
    profileImageRequestSchema
  );