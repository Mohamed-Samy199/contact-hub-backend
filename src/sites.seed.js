/**
 * Your sites. Edit this file, then run:  npm run seed
 * (running it again is safe — sites are matched by `key` and updated)
 *
 * key            → used in the URL: POST /api/contact/<key>
 * receiverEmail  → where this site's messages are delivered
 * allowedOrigins → the site's real frontend domains (no trailing slash)
 */
export const sites = [
  {
    key: "alwaqt-alnajeh",
    name: "Al Waqt Al Nageh Construction and Buildings",
    receiverEmail: "moh246samy@gmail.com",
    allowedOrigins: ["http://localhost:5173"],
    brandColor: "#0A1795",
  },
  {
    key: "3mo",
    name: "3mo",
    receiverEmail: "mooh246samy@gmail.com",
    allowedOrigins: ["http://localhost:5173"],
    brandColor: "#0bb235",
  },
];