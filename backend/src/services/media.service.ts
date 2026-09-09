import fs from "node:fs/promises";
import path from "node:path";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuid } from "uuid";
import { Media } from "../models/media.model.js";
import { uploadRoot } from "../config/env.js";
import { AppError, NotFoundError } from "../utils/app-error.js";
import { writeAudit } from "./audit.service.js";
import { AUDIT_ACTIONS } from "../constants/audit-actions.js";
import type { Request } from "express";

const ALLOWED: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "application/pdf": [".pdf"]
};

export async function storeUpload(file: Express.Multer.File, req: Request, altText = "", folder = "general") {
  const detected = await fileTypeFromBuffer(file.buffer);
  if (!detected) {
    throw new AppError("File type is not allowed", 400);
  }
  const allowedExts = ALLOWED[detected.mime];
  if (!allowedExts) {
    throw new AppError("File type is not allowed", 400);
  }
  const extension = allowedExts[0] ?? `.${detected.ext}`;
  const filename = `${uuid()}${extension}`;
  const destDir = path.join(uploadRoot, folder);
  await fs.mkdir(destDir, { recursive: true });
  const dest = path.join(destDir, filename);
  await fs.writeFile(dest, file.buffer);
  const media = await Media.create({
    filename,
    originalName: file.originalname,
    mimeType: detected.mime,
    size: file.size,
    url: `/uploads/${folder}/${filename}`,
    altText,
    folder,
    uploadedBy: req.user?.id
  });
  await writeAudit({
    action: AUDIT_ACTIONS.UPLOAD_MEDIA,
    module: "media",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    entityId: String(media._id),
    newValue: { filename, mimeType: detected.mime, size: file.size }
  });
  return media;
}

export async function listMedia(page = 1, limit = 24, search?: string) {
  const filter: Record<string, unknown> = {};
  if (search) filter.originalName = new RegExp(search, "i");
  const [items, total] = await Promise.all([
    Media.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Media.countDocuments(filter)
  ]);
  return { items, total, page, limit };
}

export async function updateMedia(id: string, input: { altText?: string; folder?: string }) {
  const media = await Media.findByIdAndUpdate(id, input, { new: true });
  if (!media) throw new NotFoundError();
  return media;
}

export async function deleteMedia(id: string, req: Request) {
  const media = await Media.findById(id);
  if (!media) throw new NotFoundError();
  const filePath = path.join(uploadRoot, media.folder, media.filename);
  await fs.unlink(filePath).catch(() => undefined);
  await media.deleteOne();
  await writeAudit({
    action: AUDIT_ACTIONS.DELETE_MEDIA,
    module: "media",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    entityId: id,
    oldValue: { filename: media.filename }
  });
}
