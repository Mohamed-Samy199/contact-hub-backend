import { Router } from "express";
import { submitContact } from "./contact.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import resolveSite from "../../middlewares/site.middleware.js";
import { contactLimiter } from "../../middlewares/rateLimit.middleware.js";
import { contactSchema } from "./contact.validation.js";

const router = Router();

// Public
router.post("/:siteKey", contactLimiter, resolveSite, validate(contactSchema), submitContact);

export default router;
