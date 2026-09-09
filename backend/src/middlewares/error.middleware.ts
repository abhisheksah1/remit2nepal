import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { logger } from "../config/logger.js";
import { isProduction } from "../config/env.js";
import { AppError } from "../utils/app-error.js";

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
    return;
  }

  if ((err as { name?: string }).name === "MulterError") {
    const code = (err as { code?: string }).code;
    res.status(400).json({
      success: false,
      message: code === "LIMIT_FILE_SIZE" ? "File is too large" : err instanceof Error ? err.message : "Upload failed",
      errors: []
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors ?? []
    });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(err.errors).map((item) => ({
        field: item.path,
        message: item.message
      }))
    });
    return;
  }

  const duplicate = err as { code?: number; keyValue?: Record<string, unknown> };
  if (duplicate.code === 11000) {
    res.status(409).json({
      success: false,
      message: "A record with this unique value already exists",
      errors: Object.keys(duplicate.keyValue ?? {}).map((field) => ({
        field,
        message: "Must be unique"
      }))
    });
    return;
  }

  logger.error({ err }, "Unhandled error");
  res.status(500).json({
    success: false,
    message: isProduction ? "Internal server error" : err instanceof Error ? err.message : "Internal server error",
    errors: []
  });
};
