import multer from "multer";
import { ApiError } from "../utils/ApiError.js";
import { isDev } from "../config/env.config.js";

/**
 * Global error handler — must be registered LAST in app.bootstrap.js.
 */
const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // malformed JSON body
  if (err.type === "entity.parse.failed") {
    error = ApiError.badRequest("Invalid JSON body.");
  }

  // file upload errors (multer)
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: "The file is too large (max 5 MB).",
      LIMIT_UNEXPECTED_FILE: 'Unexpected file field. Upload the CV using the field name "cv".',
      LIMIT_FILE_COUNT: "Only one file can be uploaded.",
    };
    error = ApiError.badRequest(messages[err.code] || "Invalid file upload.");
  }

  // duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = ApiError.conflict(`${field} already exists.`);
  }

  // invalid MongoDB ObjectId
  if (err.name === "CastError") {
    error = ApiError.badRequest(`Invalid value for field: ${err.path}`);
  }

  // Mongoose validation errors (schema-level)
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.badRequest("Validation failed", errors);
  }

  const statusCode = error.statusCode || 500;
  const message = error.isOperational
    ? error.message
    : "Something went wrong. Please try again.";

  if (statusCode === 500) {
    console.error("[ SERVER ERROR ]", err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
    ...(isDev && { stack: err.stack }),
  });
};

export default errorMiddleware;
