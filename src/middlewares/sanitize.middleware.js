import xss from "xss";

const sanitizeObject = (obj) => {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "string") {
      obj[key] = xss(obj[key]);
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
};

// XSS prevention — sanitizes every string in req.body.
// Used globally (JSON bodies) and again after multer for multipart bodies.
const sanitizeBody = (req, _res, next) => {
  if (req.body) sanitizeObject(req.body);
  next();
};

export default sanitizeBody;
