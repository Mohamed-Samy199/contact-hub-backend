import { transporter } from "./mailer.js";
import { contactEmailTemplate } from "./contactTemplate.js";
import { EMAIL_USER } from "../config/env.config.js";

export const sendContactEmail = async ({ site, name, email, phone, subject, message, extra }) => {
  const html = contactEmailTemplate({ site, name, email, phone, subject, message, extra });

  await transporter.sendMail({
    from:    `"${site.name} Website" <${EMAIL_USER}>`,
    to:      site.receiverEmail,
    replyTo: email, // when the receiver replies, it goes back to the visitor
    subject: `📩 ${site.name} — New Message from ${name}`,
    html,
  });
};
