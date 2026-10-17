import Joi from "joi";

// name + email + message are required for every site.
// Everything else is optional so different sites can send different forms.
export const contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "Name is required.",
    "string.empty": "Name is required.",
    "string.min":   "Name must be at least 2 characters.",
  }),
  email: Joi.string().trim().email({ tlds: { allow: false } }).lowercase().max(150).required().messages({
    "any.required": "Email is required.",
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email.",
  }),
  phone: Joi.string().trim().min(5).max(25).allow("").optional().messages({
    "string.min": "Phone number is too short.",
  }),
  subject: Joi.string().trim().max(100).allow("").optional(),
  message: Joi.string().trim().min(5).max(2000).required().messages({
    "any.required": "Message is required.",
    "string.empty": "Message is required.",
    "string.min":   "Message must be at least 5 characters.",
  }),

  // any additional fields of a specific site's form, e.g. { company: "ACME", budget: "5k" }
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
