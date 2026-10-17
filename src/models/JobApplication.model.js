import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
      index: true,
    },
    siteKey: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    position: {
      type: String,
      trim: true,
      default: "",
    },
    branch: {
      type: String,
      trim: true,
      default: "",
    },
    experience: {
      type: Number,
      min: 0,
      max: 60,
    },
    message: {
      type: String,
      default: "",
    },
    // any additional fields a specific site's form sends
    extra: {
      type: mongoose.Schema.Types.Mixed,
      default: undefined,
    },
    // the CV itself is only attached to the email — here we keep its details
    cv: {
      type: new mongoose.Schema(
        {
          originalName: String,
          mimeType: String,
          size: Number,
        },
        { _id: false }
      ),
      default: undefined,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    emailStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    emailError: {
      type: String,
    },
    ip: {
      type: String,
    },
  },
  { timestamps: true }
);

const JobApplication =
  mongoose.models.JobApplication || mongoose.model("JobApplication", jobApplicationSchema);
export default JobApplication;
