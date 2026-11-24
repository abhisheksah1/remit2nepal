import type { Request } from "express";
import { LeaveTrackerUser, type LeaveTrackerUserDocument } from "../models/leave-tracker-user.model.js";
import { LeaveRefreshToken } from "../models/leave-refresh-token.model.js";
import { AppError, UnauthorizedError } from "../utils/app-error.js";
import {
  hashSecret,
  randomToken,
  sha256,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifySecret
} from "./token.service.js";

const LOCK_THRESHOLD = 8;
const LOCK_MINUTES = 30;

function publicUser(user: LeaveTrackerUserDocument) {
  return {
    id: String(user._id),
    userId: user.userId,
    fullName: user.fullName,
    email: user.email,
    mustChangePassword: Boolean(user.mustChangePassword)
  };
}

async function issueSession(user: LeaveTrackerUserDocument, rememberMe: boolean) {
  const sessionUser = publicUser(user);
  const accessToken = signAccessToken({
    sub: sessionUser.id,
    userId: sessionUser.userId,
    fullName: sessionUser.fullName,
    role: "ADMIN",
    permissions: ["leave_tracker"],
    mustChangePassword: sessionUser.mustChangePassword,
    typ: "leave"
  });
  const refreshToken = signRefreshToken(sessionUser.id, randomToken());
  const days = rememberMe ? 30 : 7;
  await LeaveRefreshToken.create({
    user: user._id,
    tokenHash: sha256(refreshToken),
    rememberMe,
    expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000)
  });
  return { accessToken, refreshToken, rememberMe, user: sessionUser };
}

export async function login(userId: string, password: string, rememberMe: boolean) {
  const user = await LeaveTrackerUser.findOne({ userId: userId.toLowerCase() }).select("+passwordHash");
  if (!user) throw new UnauthorizedError("Invalid user ID or password");

  if (user.lockUntil && user.lockUntil > new Date()) {
    throw new AppError("Account is temporarily locked. Try again later.", 423);
  }
  if (user.status === "INACTIVE") throw new AppError("Account is inactive", 403);

  const valid = await verifySecret(user.passwordHash, password);
  if (!valid) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= LOCK_THRESHOLD) {
      user.status = "LOCKED";
      user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
    }
    await user.save();
    throw new UnauthorizedError("Invalid user ID or password");
  }

  user.failedLoginAttempts = 0;
  user.set("lockUntil", undefined);
  if (user.status === "LOCKED") user.status = "ACTIVE";
  user.lastLoginAt = new Date();
  await user.save();
  return issueSession(user, rememberMe);
}

export async function refreshSession(token: string) {
  if (!token) throw new UnauthorizedError("Session expired");
  const payload = verifyRefreshToken(token);
  const stored = await LeaveRefreshToken.findOne({ tokenHash: sha256(token) });
  if (!stored || stored.expiresAt < new Date()) throw new UnauthorizedError("Session expired");
  const user = await LeaveTrackerUser.findById(payload.sub);
  if (!user || user.status !== "ACTIVE") throw new UnauthorizedError("Account is not active");
  await stored.deleteOne();
  return issueSession(user, Boolean(stored.rememberMe));
}

export async function logout(token?: string) {
  if (!token) return;
  await LeaveRefreshToken.deleteOne({ tokenHash: sha256(token) });
}

export async function currentUser(id: string) {
  const user = await LeaveTrackerUser.findById(id);
  if (!user || user.status !== "ACTIVE") throw new UnauthorizedError("Account is not active");
  return { user: publicUser(user) };
}

export async function hashLeavePassword(password: string) {
  return hashSecret(password);
}
