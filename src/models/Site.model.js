import mongoose from "mongoose";

const normalizeOrigin = (v) => String(v).trim().toLowerCase().replace(/\/+$/, "");

const siteSchema = new mongoose.Schema(
  {
    // used in the URL: POST /api/contact/:key
    key: {
      type: String,
      required: [true, "Site key is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, "Site key can contain only a-z, 0-9 and -"],
    },
    name: {
      type: String,
      required: [true, "Site name is required"],
      trim: true,
    },
    // where this site's messages are delivered (comma separated for several addresses)
    receiverEmail: {
      type: String,
      required: [true, "Receiver email is required"],
      trim: true,
    },
    // optional: separate inbox for job applications (falls back to receiverEmail when empty)
    careersReceiverEmail: {
      type: String,
      trim: true,
      default: "",
    },
    // frontend domains allowed to call the API for this site (CORS + origin check)
    allowedOrigins: {
      type: [{ type: String, set: normalizeOrigin }],
      default: [],
    },
    // used in the email template header
    brandColor: {
      type: String,
      default: "#1e5a96",
      match: [/^#[0-9a-fA-F]{6}$/, "brandColor must be a hex color like #1e5a96"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Site = mongoose.models.Site || mongoose.model("Site", siteSchema);
export default Site;
