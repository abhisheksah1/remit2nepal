import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ACCESS_COOKIE } from "../config/cookies.js";
import { UnauthorizedError } from "../utils/app-error.js";
import type { AccessTokenPayload } from "../services/token.service.js";
import { User } from "../models/user.model.js";
import { ROLES } from "../constants/roles.js";
import { PERMISSIONS } from "../constants/permissions.js";

async function sessionFromToken(token: string) {
  const payload = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
  const user = await User.findById(payload.sub);
  if (!user || user.status !== "ACTIVE") {
    return null;
  }
  const permissions = user.role === ROLES.SUPER_ADMIN ? [...PERMISSIONS] : user.permissions;
  return {
    id: String(user._id),
    userId: user.userId,
    fullName: user.fullName,
    role: user.role,
    permissions,
    mustChangePassword: Boolean(user.mustChangePassword)
  };
}

export async function authMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.[ACCESS_COOKIE] as string | undefined;
  if (!token) {
    next(new UnauthorizedError());
    return;
  }
  try {
    const user = await sessionFromToken(token);
    if (!user) {
      next(new UnauthorizedError("Account is not active"));
      return;
    }
    req.user = user;
    next();
  } catch {
    next(new UnauthorizedError("Session expired"));
  }
}

export async function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.[ACCESS_COOKIE] as string | undefined;
  if (!token) {
    next();
    return;
  }
  try {
    const user = await sessionFromToken(token);
    if (user) req.user = user;
  } catch {
    // ignore invalid optional token
  }
  next();
}
