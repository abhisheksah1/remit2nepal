import type { PermissionKey } from "@/types/api";
import type { AuthUser } from "@/types/auth";

export function hasPermission(user: AuthUser | null | undefined, permission?: PermissionKey): boolean {
  if (!user) return false;
  if (!permission) return true;
  if (user.role === "SUPER_ADMIN") return true;
  return user.permissions.includes(permission);
}

export function usePermission(user: AuthUser | null | undefined) {
  return {
    can: (permission?: PermissionKey) => hasPermission(user, permission),
    isSuperAdmin: user?.role === "SUPER_ADMIN"
  };
}
