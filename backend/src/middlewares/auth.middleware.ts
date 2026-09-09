import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ACCESS_COOKIE } from "../config/cookies.js";
import { UnauthorizedError } from "../utils/app-error.js";
import type { AccessTokenPayload } from "../services/token.service.js";

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[ACCESS_COOKIE] as string | undefined;
  if (!token) {
    next(new UnauthorizedError());
    return;
  }
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
    req.user = {
      id: payload.sub,
      userId: payload.userId,
      fullName: payload.fullName,
      role: payload.role,
      permissions: payload.permissions,
      mustChangePassword: payload.mustChangePassword
    };
    next();
  } catch {
    next(new UnauthorizedError("Session expired"));
  }
}

export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[ACCESS_COOKIE] as string | undefined;
  if (!token) {
    next();
    return;
  }
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
    req.user = {
      id: payload.sub,
      userId: payload.userId,
      fullName: payload.fullName,
      role: payload.role,
      permissions: payload.permissions,
      mustChangePassword: payload.mustChangePassword
    };
  } catch {
    // ignore invalid optional token
  }
  next();
}
