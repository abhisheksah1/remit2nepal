import type { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../utils/app-error.js";
import { ROLES } from "../constants/roles.js";
import type { PermissionKey } from "../constants/permissions.js";

export function requirePermission(...permissions: PermissionKey[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }
    if (req.user.role === ROLES.SUPER_ADMIN) {
      next();
      return;
    }
    const allowed = permissions.every((permission) => req.user?.permissions.includes(permission));
    if (!allowed) {
      next(new ForbiddenError());
      return;
    }
    next();
  };
}

export function requireSuperAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(new UnauthorizedError());
    return;
  }
  if (req.user.role !== ROLES.SUPER_ADMIN) {
    next(new ForbiddenError("Super admin access required"));
    return;
  }
  next();
}

export function requirePasswordReady(req: Request, _res: Response, next: NextFunction): void {
  if (req.user?.mustChangePassword && !req.path.includes("/change-password")) {
    next(new ForbiddenError("Password change required"));
    return;
  }
  next();
}
