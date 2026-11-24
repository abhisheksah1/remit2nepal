import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { LEAVE_ACCESS_COOKIE } from "../config/cookies.js";
import { UnauthorizedError } from "../utils/app-error.js";
import type { AccessTokenPayload } from "../services/token.service.js";
import { LeaveTrackerUser } from "../models/leave-tracker-user.model.js";

export async function leaveAuthMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.[LEAVE_ACCESS_COOKIE] as string | undefined;
  if (!token) {
    next(new UnauthorizedError());
    return;
  }
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
    if (payload.typ !== "leave") {
      next(new UnauthorizedError("Session expired"));
      return;
    }
    const user = await LeaveTrackerUser.findById(payload.sub);
    if (!user || user.status !== "ACTIVE") {
      next(new UnauthorizedError("Account is not active"));
      return;
    }
    req.user = {
      id: String(user._id),
      userId: user.userId,
      fullName: user.fullName,
      role: "ADMIN",
      permissions: ["leave_tracker"],
      mustChangePassword: Boolean(user.mustChangePassword)
    };
    next();
  } catch {
    next(new UnauthorizedError("Session expired"));
  }
}
