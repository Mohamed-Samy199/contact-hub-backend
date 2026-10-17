import { ApiError } from "../../utils/ApiError.js";

// multipart bodies can only carry strings, so `extra` arrives as a JSON string — parse it.
export const parseExtra = (req, _res, next) => {
  if (typeof req.body?.extra === "string") {
    try {
      req.body.extra = JSON.parse(req.body.extra);
    } catch {
      return next(ApiError.badRequest("`extra` must be valid JSON."));
    }
  }
  next();
};
