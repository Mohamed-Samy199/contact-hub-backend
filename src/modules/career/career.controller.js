import * as careerService from "./career.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

/**
 * POST /api/careers/:siteKey   (multipart/form-data, optional file field "cv")
 * Public — anyone can send a job application to the site identified by :siteKey
 */
export const submitApplication = asyncHandler(async (req, res) => {
  const application = await careerService.submitApplication({
    site: req.site,
    data: req.body,
    file: req.file,
    ip: req.ip,
  });

  return ApiResponse.created(
    res,
    "Application submitted successfully. We'll contact you soon!",
    { application }
  );
});
