# Contact Hub Backend

One shared backend that receives **Contact Us** messages and **job applications (Careers)** from multiple websites. Every submission is stored in MongoDB and forwarded by email to the inbox of the site it came from.

Built in the same style as `bella-smile-backend`: Express + Mongoose + Joi + Nodemailer, with a `modules/` structure.

## Features

- One API for many websites. Each site is identified by a `siteKey` in the URL.
- Per-site inbox: each site has its own receiver email (and an optional separate one for careers).
- Per-site CORS and origin check, so one site's key can't be used from another site's domain.
- Contact form (JSON) and careers form (multipart with an optional CV).
- CV is attached to the email (PDF / DOC / DOCX, max 5 MB, content verified by file signature).
- Failed emails never lose data: the submission is saved first, and `emailStatus` / `emailError` record what happened.
- Spam protection: rate limiting, honeypot field, XSS sanitizing, NoSQL injection protection.
- Adding a new site needs no code change.

## Tech stack

Node.js (ES Modules), Express 4, MongoDB + Mongoose, Joi, Nodemailer (Gmail SMTP), Multer (memory storage), Helmet, CORS, express-rate-limit, express-mongo-sanitize, xss.

## Project structure

```
index.js
src/
  main.js                     # connects DB, starts the server
  app.bootstrap.js            # middlewares + routes
  seed.js                     # upserts the sites into the DB
  sites.seed.js               # YOUR sites config (edit this)
  config/env.config.js
  db/                         # connection + generic CRUD helpers
  models/                     # Site, ContactMessage, JobApplication
  middlewares/                # site resolver, validate, upload, sanitize, rate limit, errors
  modules/
    contact/                  # routes, controller, service, validation
    career/                   # routes, controller, service, validation, middleware
    site/                     # site lookup with 1-minute in-memory cache
  utils/                      # ApiError, ApiResponse, asyncHandler, mailer, email templates
```

## Getting started

```bash
npm install
cp .env.example .env     # then fill in the values
npm run seed             # creates/updates the sites in MongoDB
npm run dev              # development (nodemon)
npm start                # production
```

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | yes | e.g. `mongodb://127.0.0.1:27017/contact-hub` for local development |
| `EMAIL_USER` | yes | Gmail account that **sends** all emails |
| `EMAIL_PASS` | yes | Gmail **App Password** (not the normal password; requires 2-Step Verification) |
| `PORT` | no | Defaults to `5000` |
| `NODE_ENV` | no | `development` or `production` |
| `EXTRA_ORIGINS` | no | Extra allowed origins, comma separated. In development, `http://localhost:5173` and `:3000` are allowed by default |

Do not use quotes or spaces around `=` in `.env`.

## Configuring sites

Edit `src/sites.seed.js`, then run `npm run seed` (safe to run repeatedly; sites are matched by `key`).

```js
export const sites = [
  {
    key: "alwaqt-alnajeh",                       // used in the URL
    name: "الوقت الناجح",
    receiverEmail: "inbox@example.com",          // contact messages go here
    careersReceiverEmail: "hr@example.com",      // optional, falls back to receiverEmail
    allowedOrigins: ["https://example.com", "https://www.example.com"],
    brandColor: "#1e5a96",                       // email header color
  },
];
```

| Field | Meaning |
|---|---|
| `key` | Lowercase letters, numbers and `-`. Appears in the endpoint URL |
| `name` | Shown in the email header and sender name |
| `receiverEmail` | Inbox for this site. Several addresses allowed, comma separated |
| `careersReceiverEmail` | Optional separate inbox for job applications |
| `allowedOrigins` | The site's real frontend domains, no trailing slash |
| `brandColor` | Hex color used in the email template |
| `isActive` | Set to `false` to disable a site |

Sites are cached in memory for 1 minute, so changes can take up to a minute to apply (or restart the server).

## API

Base path: `/api`

### `GET /api/health`

Returns `{ "success": true, "message": "Contact Hub API is running." }`.

### `POST /api/contact/:siteKey`

`Content-Type: application/json`

| Field | Required | Rules |
|---|---|---|
| `name` | yes | 2–100 characters |
| `email` | yes | valid email |
| `message` | yes | 5–2000 characters |
| `phone` | no | 5–25 characters |
| `subject` | no | up to 100 characters |
| `extra` | no | object with extra site-specific fields (max 15, values are strings/numbers/booleans) |
| `website` | no | honeypot, keep empty |

```bash
curl -X POST http://localhost:5000/api/contact/alwaqt-alnajeh \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@mail.com","message":"Hello there"}'
```

### `POST /api/careers/:siteKey`

`Content-Type: multipart/form-data`

| Field | Required | Rules |
|---|---|---|
| `name` | yes | 2–100 characters |
| `phone` | yes | digits, `+ - ( )` and spaces, at least 7 characters |
| `email` | no | valid email |
| `position` | no | free text, up to 100 characters |
| `branch` | no | free text, up to 100 characters |
| `experience` | no | whole number 0–60 |
| `message` | no | up to 2000 characters |
| `extra` | no | JSON string of extra site-specific fields |
| `cv` | no | PDF, DOC or DOCX, max 5 MB |
| `website` | no | honeypot, keep empty |

```bash
curl -X POST http://localhost:5000/api/careers/alwaqt-alnajeh \
  -F "name=Test User" -F "phone=+966500000000" \
  -F "position=Sales Manager" -F "experience=3" \
  -F "cv=@/path/to/cv.pdf"
```

The CV is **only attached to the email**. The database keeps its name, size and type, not the file itself.

### Responses

Success (`201`):

```json
{ "success": true, "message": "...", "data": { "contact": { "id": "...", "createdAt": "..." } } }
```

(`data.application` for careers.)

Errors use `{ "success": false, "message": "...", "errors": [] }`:

| Status | Meaning |
|---|---|
| `400` | Validation failed, invalid JSON, or invalid/oversized CV |
| `403` | Origin not allowed for this site |
| `404` | Unknown site key |
| `429` | Too many requests |
| `500` | Unexpected server error |

If the email fails to send, the visitor still gets `201`, and the record is saved with `emailStatus: "failed"` and the reason in `emailError`.

## Rate limits (per IP)

| Scope | Limit |
|---|---|
| All `/api` routes | 100 requests / 15 minutes |
| Contact form | 5 messages / 15 minutes |
| Careers form | 10 applications / hour |

## Frontend integration

Set the API base URL in the frontend `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

- **Contact:** send JSON to `/contact/<siteKey>`.
- **Careers:** send `FormData` to `/careers/<siteKey>`. With axios, override the header per request (`'Content-Type': 'multipart/form-data'`). A default `application/json` header makes axios convert the FormData to JSON and the file is lost.
- Send human-readable text for `subject`, `position` and `branch` (for example the translated label), because it appears as-is in the email.
- Add a hidden `website` input (honeypot) to every form.

## Adding a new website

1. Add an entry to `src/sites.seed.js` with a new `key`, `receiverEmail` and `allowedOrigins`.
2. Run `npm run seed`.
3. Point the new site's form to `POST /api/contact/<key>` or `POST /api/careers/<key>`.

## Email setup (Gmail)

1. Enable 2-Step Verification on the sending Google account.
2. Create an App Password at https://myaccount.google.com/apppasswords.
3. Put the account in `EMAIL_USER` and the 16-character password in `EMAIL_PASS`.

All emails are sent from this one account. The receiver differs per site, and the `Reply-To` header is the visitor's email, so replying goes straight to them.

If you see `535 BadCredentials`, the password is not an App Password or `EMAIL_USER` is wrong. The server logs `✅ Mailer ready` on startup when SMTP works.

## Notes

- Messages are stored in the `contactmessages` collection and applications in `jobapplications`, each linked to its site.
- `isRead` is stored on every record for a future admin view. There is no admin API yet.
- If SMTP certificate errors appear on your hosting, add `tls: { rejectUnauthorized: false }` to the transporter in `src/utils/mailer.js` (not recommended unless needed).