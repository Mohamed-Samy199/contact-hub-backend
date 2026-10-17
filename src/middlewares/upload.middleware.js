import path from "path";
import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

export const MAX_CV_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = {
  ".pdf":  ["application/pdf"],
  ".doc":  ["application/msword"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
};

// first bytes of each real file type (the mimetype header alone can be faked)
const SIGNATURES = {
  ".pdf":  [Buffer.from("%PDF")],
  ".doc":  [Buffer.from([0xd0, 0xcf, 0x11, 0xe0])],
  ".docx": [Buffer.from([0x50, 0x4b, 0x03, 0x04])],
};

const upload = multer({
  storage: multer.memoryStorage(), // the CV is attached to the email, not written to disk
  limits: { fileSize: MAX_CV_SIZE, files: 1, fields: 20, fieldSize: 10 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedMimes = ALLOWED_TYPES[ext];
    const mimeOk = allowedMimes && (allowedMimes.includes(file.mimetype) || file.mimetype === "application/octet-stream");

    if (!mimeOk) {
      return cb(ApiError.badRequest("CV must be a PDF, DOC or DOCX file."));
    }
    cb(null, true);
  },
});

// field name: "cv" (optional)
export const uploadCv = upload.single("cv");

// Runs after uploadCv: checks the file content really is a PDF / DOC / DOCX
export const validateCvSignature = (req, _res, next) => {
  if (!req.file) return next();

  const ext = path.extname(req.file.originalname).toLowerCase();
  const head = req.file.buffer;
  const ok = (SIGNATURES[ext] || []).some((sig) => head.subarray(0, sig.length).equals(sig));

  if (!ok) {
    return next(ApiError.badRequest("The uploaded CV is not a valid PDF, DOC or DOCX file."));
  }
  next();
};
