import JobApplication from "../../models/JobApplication.model.js";
import { create, updateOne } from "../../db/database.repository.js";
import { sendApplicationEmail } from "../../utils/sendApplicationEmail.js";
import { fixFileName } from "../../utils/fileName.js";

export const submitApplication = async ({ site, data, file, ip }) => {
  const { name, phone, email, position, branch, experience, message, extra, website } = data;

  // honeypot filled → it's a bot. Pretend success, store nothing, send nothing.
  if (website) {
    return { id: null };
  }

  const cv = file
    ? { originalName: fixFileName(file.originalname), mimeType: file.mimetype, size: file.size }
    : undefined;

  // 1) save in the DB (CV details only — the file itself goes in the email)
  const application = await create({
    model: JobApplication,
    data: {
      site: site._id,
      siteKey: site.key,
      name,
      phone,
      email,
      position,
      branch,
      experience: experience === "" ? undefined : experience,
      message,
      extra,
      cv,
      ip,
    },
  });

  // 2) forward to this site's careers inbox (falls back to its main inbox)
  try {
    await sendApplicationEmail({
      site,
      to: site.careersReceiverEmail || site.receiverEmail,
      data: { name, phone, email, position, branch, experience, message, extra },
      cv,
      file,
    });
    await updateOne({
      model: JobApplication,
      filter: { _id: application._id },
      update: { $set: { emailStatus: "sent" } },
    });
  } catch (err) {
    // email failure must not fail the applicant's request — the application is already saved
    console.error("❌ Failed to send application email:", err.message);
    await updateOne({
      model: JobApplication,
      filter: { _id: application._id },
      update: { $set: { emailStatus: "failed", emailError: err.message } },
    });
  }

  return { id: application._id, createdAt: application.createdAt };
};
