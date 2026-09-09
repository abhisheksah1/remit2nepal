import type { Request } from "express";

export function clientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() ?? req.ip ?? "unknown";
  }
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

export function userAgent(req: Request): string {
  return req.get("user-agent") ?? "unknown";
}
