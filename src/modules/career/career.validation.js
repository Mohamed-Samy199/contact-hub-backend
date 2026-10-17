import Joi from "joi";

// name + phone are required for every site. Everything else is optional,
// so different sites can send different application forms.
export const applicationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "Name is required.",
    "string.empty": "Name is required.",
    "string.min":   "Name must be at least 2 characters.",
  }),
  phone: Joi.string().trim().pattern(/^[+\d\s()-]{7,}$/).max(25).required().messages({
    "any.required":        "Phone is required.",
    "string.empty":        "Phone is required.",
    "string.pattern.base": "Please enter a valid phone number.",
  }),
  email: Joi.string().trim().email({ tlds: { allow: false } }).lowercase().max(150).allow("").optional().messages({
    "string.email": "Please enter a valid email.",
  }),
  position: Joi.string().trim().max(100).allow("").optional(),
  branch: Joi.string().trim().max(100).allow("").optional(),
  experience: Joi.number().integer().min(0).max(60).allow("").optional().messages({
    "number.base": "Experience must be a number.",
    "number.min":  "Experience must be between 0 and 60 years.",
    "number.max":  "Experience must be between 0 and 60 years.",
  }),
  message: Joi.string().trim().max(2000).allow("").optional(),

  // any additional fields of a specific site's form, e.g. { "Expected salary": "5000" }
  extra: Joi.object()
    .pattern(
      Joi.string().max(50),
      Joi.alternatives(Joi.string().max(500).allow(""), Joi.number(), Joi.boolean())
    )
    .max(15)
    .optional(),

  // honeypot — real users never fill this (hidden input); bots do
  website: Joi.string().max(200).allow("").optional(),
});
