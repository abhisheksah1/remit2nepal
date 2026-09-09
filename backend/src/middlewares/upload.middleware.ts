import multer from "multer";
import { env } from "../config/env.js";

const fileSize = env.UPLOAD_MAX_FILE_SIZE_MB * 1024 * 1024;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize,
    files: 1
  }
});

export const uploadMany = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize,
    files: 8
  }
});
