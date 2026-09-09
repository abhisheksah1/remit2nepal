import { AuditLog } from "../models/audit-log.model.js";
import type { AuditAction } from "../constants/audit-actions.js";

interface AuditInput {
  userId?: string;
  userName?: string;
  action: AuditAction | string;
  module: string;
  entityId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string;
  userAgent?: string;
}

const SENSITIVE = /password|secret|token|hash/i;

function redact(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redact);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
        key,
        SENSITIVE.test(key) ? "[redacted]" : redact(nested)
      ])
    );
  }
  return value;
}

export async function writeAudit(input: AuditInput): Promise<void> {
  await AuditLog.create({
    userId: input.userId ?? "system",
    userName: input.userName ?? "system",
    action: input.action,
    module: input.module,
    entityId: input.entityId ?? "",
    oldValue: redact(input.oldValue),
    newValue: redact(input.newValue),
    ipAddress: input.ipAddress ?? "",
    userAgent: input.userAgent ?? ""
  });
}

export async function listAuditLogs(params: {
  page: number;
  limit: number;
  module?: string;
  userId?: string;
  action?: string;
}) {
  const filter: Record<string, string> = {};
  if (params.module) filter.module = params.module;
  if (params.userId) filter.userId = params.userId;
  if (params.action) filter.action = params.action;
  const skip = (params.page - 1) * params.limit;
  const [items, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(params.limit).lean(),
    AuditLog.countDocuments(filter)
  ]);
  return { items, total, page: params.page, limit: params.limit };
}
