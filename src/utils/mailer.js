import nodemailer from "nodemailer";
import dns from "dns";
import { EMAIL_USER, EMAIL_PASS } from "../config/env.config.js";

dns.setDefaultResultOrder("ipv4first");

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // false with 587 (STARTTLS)
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS, // Gmail App Password
  },
  family: 4,
});

// check the connection at startup
transporter.verify((error) => {
  if (error) {
    console.error("❌ Mailer connection failed:", error.message);
  } else {
    console.log("✅ Mailer ready");
  }
});
