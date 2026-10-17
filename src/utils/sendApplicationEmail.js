import { transporter } from "./mailer.js";
import { applicationEmailTemplate } from "./applicationTemplate.js";
import { EMAIL_USER } from "../config/env.config.js";

export const sendApplicationEmail = async ({ site, to, data, cv, file }) => {
  const html = applicationEmailTemplate({ site, ...data, cv });

  await transporter.sendMail({
    from:    `"${site.name} Careers" <${EMAIL_USER}>`,
    to,
    replyTo: data.email || undefined, // reply goes to the applicant when they gave an email
    subject: `📄 ${site.name} — New Job Application from ${data.name}${data.position ? ` (${data.position})` : ""}`,
    html,
    attachments: file
      ? [{ filename: cv.originalName, content: file.buffer, contentType: file.mimetype }]
      : [],
  });
};
