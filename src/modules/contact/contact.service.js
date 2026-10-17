import ContactMessage from "../../models/ContactMessage.model.js";
import { create, updateOne } from "../../db/database.repository.js";
import { sendContactEmail } from "../../utils/sendContactEmail.js";

export const submitContact = async ({ site, data, ip }) => {
  const { name, email, phone, subject, message, extra, website } = data;

  // honeypot filled → it's a bot. Pretend success, store nothing, send nothing.
  if (website) {
    return { id: null };
  }

  // 1) save in the DB
  const contact = await create({
    model: ContactMessage,
    data: {
      site: site._id,
      siteKey: site.key,
      name,
      email,
      phone,
      subject,
      message,
      extra,
      ip,
    },
  });

  // 2) forward to this site's own email
  try {
    await sendContactEmail({ site, name, email, phone, subject, message, extra });
    await updateOne({
      model: ContactMessage,
      filter: { _id: contact._id },
      update: { $set: { emailStatus: "sent" } },
    });
  } catch (err) {
    // email failure must not fail the visitor's request — the message is already saved
    console.error("❌ Failed to send contact email:", err.message);
    await updateOne({
      model: ContactMessage,
      filter: { _id: contact._id },
      update: { $set: { emailStatus: "failed", emailError: err.message } },
    });
  }

  return { id: contact._id, createdAt: contact.createdAt };
};
