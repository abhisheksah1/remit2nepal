import fs from "node:fs/promises";
import path from "node:path";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuid } from "uuid";
import { privateUploadRoot } from "../config/env.js";
import { AppError } from "../utils/app-error.js";

const ALLOWED: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"]
};

export async function validateUploadBuffer(file: Express.Multer.File) {
  const detected = await fileTypeFromBuffer(file.buffer);
  if (!detected) {
    throw new AppError(`${file.originalname || "File"} type is not allowed`, 400);
  }
  const allowedExts = ALLOWED[detected.mime];
  if (!allowedExts) {
    throw new AppError("Only PDF or image files are accepted", 400);
  }
  return { mime: detected.mime, extension: allowedExts[0] ?? `.${detected.ext}` };
}

export async function writePrivateFile(folder: string, file: Express.Multer.File) {
  const detected = await validateUploadBuffer(file);
  const storedName = `${uuid()}${detected.extension}`;
  const destDir = path.join(privateUploadRoot, folder);
  await fs.mkdir(destDir, { recursive: true });
  await fs.writeFile(path.join(destDir, storedName), file.buffer);
  return {
    storedName,
    originalName: file.originalname || storedName,
    mimeType: detected.mime,
    size: file.size
  };
}

export function privateFilePath(folder: string, storedName: string) {
  const destDir = path.resolve(privateUploadRoot, folder);
  const dest = path.resolve(destDir, storedName);
  if (!dest.startsWith(destDir + path.sep) || storedName.includes("..") || storedName.includes("/") || storedName.includes("\\")) {
    throw new AppError("Invalid file path", 400);
  }
  return dest;
}

export async function removePrivateFile(folder: string, storedName: string) {
  if (!storedName) return;
  await fs.unlink(privateFilePath(folder, storedName)).catch(() => undefined);
}

export async function removePrivateFolder(folder: string) {
  const destDir = path.resolve(privateUploadRoot, folder);
  if (!destDir.startsWith(path.resolve(privateUploadRoot) + path.sep)) return;
  await fs.rm(destDir, { recursive: true, force: true }).catch(() => undefined);
}
