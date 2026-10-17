import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";

import errorMiddleware from "./middlewares/error.middleware.js";
import sanitizeBody from "./middlewares/sanitize.middleware.js";
import contactRoutes from "./modules/contact/contact.routes.js";
import careerRoutes from "./modules/career/career.routes.js";
import { getAllowedOrigins } from "./modules/site/site.service.js";

import { ApiError } from "./utils/ApiError.js";
import { generalLimiter } from "./middlewares/rateLimit.middleware.js";
import { EXTRA_ORIGINS, isDev } from "./config/env.config.js";

const app = express();

// ── Security & Parsing Middlewares ────────────────────────────────────────────
app.set("trust proxy", 1);
app.use(helmet());

// CORS — allowed origins come from the sites stored in the DB (+ EXTRA_ORIGINS for dev)
app.use(
  cors({
    origin: async (origin, callback) => {
      // no origin (Postman / server-to-server)
      if (!origin) return callback(null, true);

      try {
        const normalized = origin.toLowerCase().replace(/\/+$/, "");
        const allowed = [...EXTRA_ORIGINS, ...(await getAllowedOrigins())];

        if (allowed.includes(normalized)) return callback(null, true);
        return callback(ApiError.forbidden("Not allowed by CORS"));
      } catch (err) {
        return callback(err);
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// ── XSS Prevention — sanitize body strings (after the body is parsed) ─────────
app.use(sanitizeBody);

// ── NoSQL Injection Prevention ────────────────────────────────
app.use(mongoSanitize());

// Compression
app.use(compression());

app.use("/api", generalLimiter);

if (isDev) {
  app.use(morgan("dev"));
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/contact", contactRoutes);
app.use("/api/careers", careerRoutes);

// health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Contact Hub API is running." });
});

// catch-all for unknown routes
app.all("*", (req, res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found.`));
});

// ── Global Error Handler (must be last) ───────────────────────────────────────
app.use(errorMiddleware);

export default app;
