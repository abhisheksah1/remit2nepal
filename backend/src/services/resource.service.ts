import type { Request } from "express";
import type { Model } from "mongoose";
import { writeAudit } from "./audit.service.js";
import { NotFoundError } from "../utils/app-error.js";
import { clientIp, userAgent } from "../utils/request-meta.js";
import { sanitizeRichText } from "../utils/sanitize.js";

interface CrudOptions {
  module: string;
  searchFields?: string[];
  richTextFields?: string[];
  publicFilter?: Record<string, unknown>;
}

export interface CrudService<T> {
  list: (
    page?: number,
    limit?: number,
    search?: string,
    extra?: Record<string, unknown>
  ) => Promise<{ items: unknown[]; total: number; page: number; limit: number }>;
  publicList: () => Promise<unknown[]>;
  get: (id: string) => Promise<T>;
  create: (input: Record<string, unknown>, req?: Request) => Promise<T>;
  update: (id: string, input: Record<string, unknown>, req?: Request) => Promise<T>;
  remove: (id: string, req?: Request) => Promise<T>;
}

export function createResourceService<T>(Model: Model<T>, options: CrudOptions): CrudService<T> {
  return {
    async list(page = 1, limit = 20, search?: string, extra: Record<string, unknown> = {}) {
      const filter: Record<string, unknown> = { ...extra };
      if (search && options.searchFields?.length) {
        filter.$or = options.searchFields.map((field) => ({ [field]: new RegExp(search, "i") }));
      }
      const [items, total] = await Promise.all([
        Model.find(filter as never)
          .sort({ displayOrder: 1, createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Model.countDocuments(filter as never)
      ]);
      return { items, total, page, limit };
    },
    async publicList() {
      return Model.find((options.publicFilter ?? { status: "ACTIVE" }) as never)
        .sort({ displayOrder: 1, createdAt: -1 })
        .lean();
    },
    async get(id: string) {
      const item = await Model.findById(id);
      if (!item) throw new NotFoundError();
      return item;
    },
    async create(input: Record<string, unknown>, req?: Request) {
      const payload = sanitizeFields(input, options.richTextFields);
      const item = new Model(payload as never);
      await item.save();
      if (req?.user) {
        await writeAudit({
          action: "CREATE",
          module: options.module,
          userId: req.user.userId,
          userName: req.user.fullName,
          entityId: String(item.id),
          newValue: item,
          ipAddress: clientIp(req),
          userAgent: userAgent(req)
        });
      }
      return item;
    },
    async update(id: string, input: Record<string, unknown>, req?: Request) {
      const item = await Model.findById(id);
      if (!item) throw new NotFoundError();
      const oldValue = item.toObject();
      Object.assign(item, sanitizeFields(input, options.richTextFields));
      await item.save();
      if (req?.user) {
        await writeAudit({
          action: "UPDATE",
          module: options.module,
          userId: req.user.userId,
          userName: req.user.fullName,
          entityId: id,
          oldValue,
          newValue: item.toObject(),
          ipAddress: clientIp(req),
          userAgent: userAgent(req)
        });
      }
      return item;
    },
    async remove(id: string, req?: Request) {
      const item = await Model.findByIdAndDelete(id);
      if (!item) throw new NotFoundError();
      if (req?.user) {
        await writeAudit({
          action: "DELETE",
          module: options.module,
          userId: req.user.userId,
          userName: req.user.fullName,
          entityId: id,
          oldValue: item,
          ipAddress: clientIp(req),
          userAgent: userAgent(req)
        });
      }
      return item;
    }
  };
}

function sanitizeFields(input: Record<string, unknown>, fields?: string[]) {
  if (!fields?.length) return input;
  const next = { ...input };
  for (const field of fields) {
    if (typeof next[field] === "string") {
      next[field] = sanitizeRichText(next[field] as string);
    }
  }
  return next;
}
