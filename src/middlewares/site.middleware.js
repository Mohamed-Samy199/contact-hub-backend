import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { EXTRA_ORIGINS } from "../config/env.config.js";
import { getSiteByKey } from "../modules/site/site.service.js";

/**
 * Resolves the site from :siteKey, makes sure it exists and is active,
 * and that the request comes from one of the site's own domains.
 * Attaches the site to req.site.
 */
const resolveSite = asyncHandler(async (req, _res, next) => {
  const site = await getSiteByKey(String(req.params.siteKey || "").toLowerCase());

  if (!site) {
    throw ApiError.notFound("Unknown site.");
  }

  const origin = req.get("origin")?.toLowerCase().replace(/\/+$/, "");
  if (origin && !site.allowedOrigins.includes(origin) && !EXTRA_ORIGINS.includes(origin)) {
    throw ApiError.forbidden("This origin is not allowed for this site.");
  }

  req.site = site;
  next();
});

export default resolveSite;
