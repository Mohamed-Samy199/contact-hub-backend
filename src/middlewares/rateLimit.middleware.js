import rateLimit from "express-rate-limit";

// ── General API ───────────────────────────────────────────────
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Contact form submissions (per IP) ─────────────────────────
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many messages. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Job applications (per IP) ─────────────────────────────────
export const careerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many applications. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
