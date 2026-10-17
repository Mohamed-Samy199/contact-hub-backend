const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const applicationEmailTemplate = ({
  site, name, phone, email, position, branch, experience, message, extra, cv,
}) => {
  const color = site.brandColor || "#1e5a96";

  const extraRows = extra
    ? Object.entries(extra)
        .map(([k, v]) => `<span>${escapeHtml(k)}:</span> ${escapeHtml(v)}<br/>`)
        .join("")
    : "";

  const cvLine = cv
    ? `📎 CV attached: <strong>${escapeHtml(cv.originalName)}</strong> (${Math.max(1, Math.round(cv.size / 1024))} KB)`
    : "No CV attached.";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>New Job Application — ${escapeHtml(site.name)}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: #f8f9fa; margin: 0; padding: 0; color: #333; }
        .container { max-width: 650px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
        .header { background: ${color}; color: #ffffff; padding: 35px 40px; text-align: center; }
        .header h1 { margin: 0; font-size: 23px; font-weight: 600; letter-spacing: 1px; }
        .header p { margin: 8px 0 0; opacity: 0.85; font-size: 14px; }
        .content { padding: 40px; line-height: 1.8; }
        .info { background: #f4f6f8; padding: 18px 22px; border-radius: 8px; margin: 20px 0; border-left: 5px solid ${color}; font-size: 15px; }
        .info span { color: ${color}; font-weight: 600; }
        .message-box { background: #f8f9fa; padding: 25px; border-radius: 10px; border: 1px solid #e0e0e0; font-size: 15px; color: #333; white-space: pre-wrap; line-height: 1.8; }
        .footer { background: ${color}; color: #ffffff; text-align: center; padding: 25px; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${escapeHtml(site.name)}</h1>
          <p>New Job Application</p>
        </div>

        <div class="content">
          <p>A new job application was submitted on the <strong>${escapeHtml(site.name)}</strong> website.</p>

          <div class="info">
            <span>Name:</span> ${escapeHtml(name)}<br/>
            <span>Phone:</span> ${escapeHtml(phone)}<br/>
            ${email ? `<span>Email:</span> ${escapeHtml(email)}<br/>` : ""}
            ${position ? `<span>Position:</span> ${escapeHtml(position)}<br/>` : ""}
            ${branch ? `<span>Branch:</span> ${escapeHtml(branch)}<br/>` : ""}
            ${experience !== undefined && experience !== null && experience !== "" ? `<span>Experience:</span> ${escapeHtml(experience)} year(s)<br/>` : ""}
            ${extraRows}
          </div>

          ${message ? `<p><strong>Message:</strong></p><div class="message-box" dir="auto">${escapeHtml(message)}</div>` : ""}

          <p style="margin-top:24px;">${cvLine}</p>
        </div>

        <div class="footer">
          <p>© ${new Date().getFullYear()} ${escapeHtml(site.name)} • All Rights Reserved</p>
          <p>This email was sent automatically from the careers form.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
