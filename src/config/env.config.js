import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const required = ["MONGODB_URI", "EMAIL_USER", "EMAIL_PASS"];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
});

export const NODE_ENV = process.env.NODE_ENV || "development";
export const isDev    = NODE_ENV === "development";
export const PORT     = process.env.PORT || 5000;

export const MONGODB_URI = process.env.MONGODB_URI;

export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;

// Extra origins allowed on top of each site's own allowedOrigins (mostly localhost for dev)
const defaultDevOrigins = isDev ? "http://localhost:5173,http://localhost:3000" : "";
export const EXTRA_ORIGINS = (process.env.EXTRA_ORIGINS ?? defaultDevOrigins)
  .split(",")
  .map((o) => o.trim().toLowerCase().replace(/\/+$/, ""))
  .filter(Boolean);
