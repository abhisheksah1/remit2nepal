import type { NextFunction, Request, Response } from "express";
import { CSRF_COOKIE } from "../config/cookies.js";
import { ForbiddenError } from "../utils/app-error.js";

const SAFE = new Set(["GET", "HEAD", "OPTIONS"]);

export function csrfMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (SAFE.has(req.method)) {
    next();
    return;
  }
  const path = req.originalUrl.split("?")[0] ?? "";
  if (path.endsWith("/auth/login") || path.endsWith("/auth/refresh") || path.endsWith("/public/contact")) {
    next();
    return;
  }
  const header = req.get("x-csrf-token");
  const cookie = req.cookies?.[CSRF_COOKIE] as string | undefined;
  if (!header || !cookie || header !== cookie) {
    next(new ForbiddenError("Invalid CSRF token"));
    return;
  }
  next();
}
