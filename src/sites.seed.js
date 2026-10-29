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
    receiverEmail: "info@n-alnageh.com",
    allowedOrigins: ["http://www.n-alnageh.com", "https://www.n-alnageh.com", "https://n-alnageh.com"],
    brandColor: "#0A1795",
  },
  {
    key: "3mo",
    name: "3mo",
    receiverEmail: "moh246samy@gmail.com",
    allowedOrigins: [
      "http://localhost:3000",
      "https://3modev.com",
      "https://www.3modev.com",
    ],
    brandColor: "#71BC70",
  },
];