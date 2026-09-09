import type { Request } from "express";
import { User } from "../models/user.model.js";
import { ROLES } from "../constants/roles.js";
import { PERMISSIONS, type PermissionKey } from "../constants/permissions.js";
import { AppError, ConflictError, NotFoundError } from "../utils/app-error.js";
import { hashSecret } from "./token.service.js";
import { writeAudit } from "./audit.service.js";
import { AUDIT_ACTIONS } from "../constants/audit-actions.js";
import { clientIp, userAgent } from "../utils/request-meta.js";

function strongPassword(password: string): boolean {
  return (
    password.length >= 12 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export async function listAdmins(page = 1, limit = 20, search?: string) {
  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { userId: new RegExp(search, "i") },
      { fullName: new RegExp(search, "i") },
      { email: new RegExp(search, "i") }
    ];
  }
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter)
  ]);
  return { items, total, page, limit };
}

export async function createAdmin(
  input: {
    fullName: string;
    userId: string;
    password: string;
    phone?: string;
    email?: string;
    role: "SUPER_ADMIN" | "ADMIN";
    permissions: PermissionKey[];
    status?: "ACTIVE" | "INACTIVE";
  },
  req: Request
) {
  if (req.user?.role !== ROLES.SUPER_ADMIN) {
    throw new AppError("Only super admins can create administrators", 403);
  }
  if (!strongPassword(input.password)) {
    throw new AppError("Password must be at least 12 characters and include upper, lower, number, and symbol", 400);
  }
  const exists = await User.findOne({ userId: input.userId.toLowerCase() });
  if (exists) throw new ConflictError("User ID already exists");
  const permissions = input.role === ROLES.SUPER_ADMIN ? [...PERMISSIONS] : input.permissions;
  const admin = await User.create({
    fullName: input.fullName,
    userId: input.userId.toLowerCase(),
    passwordHash: await hashSecret(input.password),
    phone: input.phone,
    email: input.email,
    role: input.role,
    permissions,
    status: input.status ?? "ACTIVE",
    mustChangePassword: true,
    createdBy: req.user.id
  });
  await writeAudit({
    action: AUDIT_ACTIONS.CREATE_ADMIN,
    module: "admins",
    userId: req.user.userId,
    userName: req.user.fullName,
    entityId: String(admin._id),
    newValue: { userId: admin.userId, role: admin.role, permissions },
    ipAddress: clientIp(req),
    userAgent: userAgent(req)
  });
  return admin;
}

export async function updateAdmin(
  id: string,
  input: Partial<{
    fullName: string;
    phone: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN";
    permissions: PermissionKey[];
    status: "ACTIVE" | "INACTIVE" | "LOCKED";
    password: string;
  }>,
  req: Request
) {
  if (req.user?.role !== ROLES.SUPER_ADMIN) {
    throw new AppError("Only super admins can update administrators", 403);
  }
  const admin = await User.findById(id);
  if (!admin) throw new NotFoundError("Admin not found");
  const oldValue = admin.toObject();
  if (input.fullName) admin.fullName = input.fullName;
  if (input.phone !== undefined) admin.phone = input.phone;
  if (input.email !== undefined) admin.email = input.email;
  if (input.role) admin.role = input.role;
  if (input.permissions) admin.permissions = input.role === ROLES.SUPER_ADMIN ? [...PERMISSIONS] : input.permissions;
  if (input.status) admin.status = input.status;
  if (input.password) {
    if (!strongPassword(input.password)) {
      throw new AppError("Password must be at least 12 characters and include upper, lower, number, and symbol", 400);
    }
    admin.passwordHash = await hashSecret(input.password);
    admin.mustChangePassword = true;
  }
  await admin.save();
  await writeAudit({
    action: AUDIT_ACTIONS.UPDATE_ADMIN,
    module: "admins",
    userId: req.user.userId,
    userName: req.user.fullName,
    entityId: id,
    oldValue,
    newValue: admin.toObject(),
    ipAddress: clientIp(req),
    userAgent: userAgent(req)
  });
  return admin;
}

export async function deactivateAdmin(id: string, req: Request) {
  if (req.user?.role !== ROLES.SUPER_ADMIN) {
    throw new AppError("Only super admins can deactivate administrators", 403);
  }
  if (req.user.id === id) {
    throw new AppError("You cannot deactivate your own account", 400);
  }
  const admin = await User.findById(id);
  if (!admin) throw new NotFoundError("Admin not found");
  admin.status = "INACTIVE";
  await admin.save();
  await writeAudit({
    action: AUDIT_ACTIONS.DELETE_ADMIN,
    module: "admins",
    userId: req.user.userId,
    userName: req.user.fullName,
    entityId: id,
    oldValue: { status: "ACTIVE" },
    newValue: { status: "INACTIVE" },
    ipAddress: clientIp(req),
    userAgent: userAgent(req)
  });
  return admin;
}
