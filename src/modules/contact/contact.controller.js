import * as contactService from "./contact.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

/**
 * POST /api/contact/:siteKey
 * Public — anyone can send a message to the site identified by :siteKey
 */
export const submitContact = asyncHandler(async (req, res) => {
  const contact = await contactService.submitContact({
    site: req.site,
    data: req.body,
    ip: req.ip,
  });

  return ApiResponse.created(
    res,
    "Message sent successfully. We'll get back to you soon!",
    { contact }
  );
});
