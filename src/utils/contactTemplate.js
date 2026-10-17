const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const contactEmailTemplate = ({ site, name, email, phone, subject, message, extra }) => {
  const color = site.brandColor || "#1e5a96";

  const extraRows = extra
    ? Object.entries(extra)
        .map(([k, v]) => `<span>${escapeHtml(k)}:</span> ${escapeHtml(v)}<br/>`)
        .join("")
    : "";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>New Contact Message — ${escapeHtml(site.name)}</title>
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
          <p>New Contact Message from the Website</p>
        </div>

        <div class="content">
          <p>You have received a new message from the <strong>${escapeHtml(site.name)}</strong> website contact form.</p>

          <div class="info">
            <span>Name:</span> ${escapeHtml(name)}<br/>
            <span>Email:</span> ${escapeHtml(email)}<br/>
            ${phone ? `<span>Phone:</span> ${escapeHtml(phone)}<br/>` : ""}
            ${subject ? `<span>Subject:</span> ${escapeHtml(subject)}<br/>` : ""}
            ${extraRows}
          </div>

          <p><strong>Message:</strong></p>
          <div class="message-box" dir="auto">${escapeHtml(message)}</div>
        </div>

        <div class="footer">
          <p>© ${new Date().getFullYear()} ${escapeHtml(site.name)} • All Rights Reserved</p>
          <p>This email was sent automatically from the contact form.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
