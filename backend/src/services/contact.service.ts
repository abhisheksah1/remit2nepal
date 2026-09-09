import { ContactMessage } from "../models/contact-message.model.js";
import { stripHtml } from "../utils/sanitize.js";
import { writeAudit } from "./audit.service.js";
import type { Request } from "express";
import { NotFoundError } from "../utils/app-error.js";

export async function createContactMessage(input: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return ContactMessage.create({
    name: stripHtml(input.name),
    email: stripHtml(input.email),
    phone: stripHtml(input.phone ?? ""),
    subject: stripHtml(input.subject),
    message: stripHtml(input.message)
  });
}

export async function listContactMessages(page = 1, limit = 20, status?: string, search?: string) {
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { subject: new RegExp(search, "i") }
    ];
  }
  const [items, total] = await Promise.all([
    ContactMessage.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ContactMessage.countDocuments(filter)
  ]);
  return { items, total, page, limit };
}

export async function updateContactStatus(id: string, status: "NEW" | "READ" | "REPLIED" | "ARCHIVED", req: Request) {
  const item = await ContactMessage.findById(id);
  if (!item) throw new NotFoundError();
  item.status = status;
  await item.save();
  await writeAudit({
    action: "UPDATE",
    module: "contact",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    entityId: id,
    newValue: { status }
  });
  return item;
}

export async function deleteContact(id: string, req: Request) {
  const item = await ContactMessage.findByIdAndDelete(id);
  if (!item) throw new NotFoundError();
  await writeAudit({
    action: "DELETE",
    module: "contact",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    entityId: id
  });
  return item;
}
