import { Router } from "express";
import { submitApplication } from "./career.controller.js";
import { parseExtra } from "./career.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import resolveSite from "../../middlewares/site.middleware.js";
import sanitizeBody from "../../middlewares/sanitize.middleware.js";
import { uploadCv, validateCvSignature } from "../../middlewares/upload.middleware.js";
import { careerLimiter } from "../../middlewares/rateLimit.middleware.js";
import { applicationSchema } from "./career.validation.js";

const router = Router();

// Public
router.post(
  "/:siteKey",
  careerLimiter,        // 1) per-IP limit
  resolveSite,          // 2) site exists + origin allowed (before reading the upload)
  uploadCv,             // 3) multipart parsing, CV in memory (max 5 MB)
  validateCvSignature,  // 4) the file content really is PDF / DOC / DOCX
  parseExtra,           // 5) `extra` JSON string → object
  sanitizeBody,         // 6) XSS clean (multipart bodies are parsed after the global sanitizer)
  validate(applicationSchema),
  submitApplication
);

export default router;
