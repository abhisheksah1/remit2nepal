import type { Request } from "express";
import { User } from "../models/user.model.js";
import { RefreshToken } from "../models/refresh-token.model.js";
import { AppError, UnauthorizedError } from "../utils/app-error.js";
import { AUDIT_ACTIONS } from "../constants/audit-actions.js";
import { writeAudit } from "./audit.service.js";
import {
  hashSecret,
  randomToken,
  sha256,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifySecret
} from "./token.service.js";
import { clientIp, userAgent } from "../utils/request-meta.js";
import { ROLES, type RoleName } from "../constants/roles.js";
import { PERMISSIONS } from "../constants/permissions.js";
import type { UserDocument } from "../models/user.model.js";

const LOCK_THRESHOLD = 8;
const LOCK_MINUTES = 30;

function strongPassword(password: string): boolean {
  return (
    password.length >= 12 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function publicUser(user: UserDocument) {
  const permissions = user.role === ROLES.SUPER_ADMIN ? [...PERMISSIONS] : user.permissions;
  return {
    id: String(user._id),
    userId: user.userId,
    fullName: user.fullName,
    role: user.role as RoleName,
    permissions,
    mustChangePassword: Boolean(user.mustChangePassword),
    email: user.email,
    phone: user.phone
  };
}

async function issueSession(user: UserDocument) {
  const sessionUser = publicUser(user);
  const accessToken = signAccessToken({
    sub: sessionUser.id,
    userId: sessionUser.userId,
    fullName: sessionUser.fullName,
    role: sessionUser.role,
    permissions: sessionUser.permissions,
    mustChangePassword: sessionUser.mustChangePassword
  });
  const refreshToken = signRefreshToken(sessionUser.id, randomToken());
  await RefreshToken.create({
    user: user._id,
    tokenHash: sha256(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  return { accessToken, refreshToken, user: sessionUser };
}

export async function login(userId: string, password: string, req: Request) {
  const user = await User.findOne({ userId: userId.toLowerCase() }).select("+passwordHash");
  const ip = clientIp(req);
  const ua = userAgent(req);

  if (!user) {
    await writeAudit({ action: AUDIT_ACTIONS.LOGIN_FAILED, module: "auth", userId, ipAddress: ip, userAgent: ua });
    throw new UnauthorizedError("Invalid user ID or password");
  }

  if (user.lockUntil && user.lockUntil > new Date()) {
    throw new AppError("Account is temporarily locked. Try again later.", 423);
  }

  if (user.status === "INACTIVE") {
    throw new AppError("Account is inactive", 403);
  }

  const valid = await verifySecret(user.passwordHash, password);
  if (!valid) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= LOCK_THRESHOLD) {
      user.status = "LOCKED";
      user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
    }
    await user.save();
    await writeAudit({
      action: AUDIT_ACTIONS.LOGIN_FAILED,
      module: "auth",
      userId: user.userId,
      userName: user.fullName,
      ipAddress: ip,
      userAgent: ua
    });
    throw new UnauthorizedError("Invalid user ID or password");
  }

  user.failedLoginAttempts = 0;
  user.set("lockUntil", undefined);
  if (user.status === "LOCKED") user.status = "ACTIVE";
  user.lastLoginAt = new Date();
  await user.save();

  await writeAudit({
    action: AUDIT_ACTIONS.LOGIN,
    module: "auth",
    userId: user.userId,
    userName: user.fullName,
    ipAddress: ip,
    userAgent: ua
  });

  return issueSession(user);
}

export async function refreshSession(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError("Invalid refresh token");
  }
  const stored = await RefreshToken.findOne({ tokenHash: sha256(refreshToken), revokedAt: { $exists: false } });
  if (!stored || stored.expiresAt < new Date()) {
    throw new UnauthorizedError("Refresh token expired");
  }
  const user = await User.findById(payload.sub);
  if (!user || user.status !== "ACTIVE") {
    throw new UnauthorizedError("Account is not active");
  }
  const sessionUser = publicUser(user);
  const accessToken = signAccessToken({
    sub: sessionUser.id,
    userId: sessionUser.userId,
    fullName: sessionUser.fullName,
    role: sessionUser.role,
    permissions: sessionUser.permissions,
    mustChangePassword: sessionUser.mustChangePassword
  });
  return { accessToken, user: sessionUser };
}

export async function currentUser(userId: string) {
  const user = await User.findById(userId);
  if (!user || user.status !== "ACTIVE") {
    throw new UnauthorizedError("Account is not active");
  }
  return { user: publicUser(user) };
}

export async function logout(refreshToken: string | undefined, req: Request) {
  if (refreshToken) {
    await RefreshToken.updateOne({ tokenHash: sha256(refreshToken) }, { revokedAt: new Date() });
  }
  if (req.user) {
    await writeAudit({
      action: AUDIT_ACTIONS.LOGOUT,
      module: "auth",
      userId: req.user.userId,
      userName: req.user.fullName,
      ipAddress: clientIp(req),
      userAgent: userAgent(req)
    });
  }
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string, req: Request) {
  if (!strongPassword(newPassword)) {
    throw new AppError("Password must be at least 12 characters and include upper, lower, number, and symbol", 400);
  }
  const user = await User.findById(userId).select("+passwordHash");
  if (!user) throw new UnauthorizedError();
  const valid = await verifySecret(user.passwordHash, currentPassword);
  if (!valid) throw new AppError("Current password is incorrect", 400);
  user.passwordHash = await hashSecret(newPassword);
  user.mustChangePassword = false;
  await user.save();
  await RefreshToken.updateMany({ user: user._id, revokedAt: { $exists: false } }, { revokedAt: new Date() });
  await writeAudit({
    action: AUDIT_ACTIONS.PASSWORD_CHANGE,
    module: "auth",
    userId: user.userId,
    userName: user.fullName,
    ipAddress: clientIp(req),
    userAgent: userAgent(req)
  });
  return issueSession(user);
}
