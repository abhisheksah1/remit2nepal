import type { PermissionKey, RoleName } from "./api";

export interface AuthUser {
  id: string;
  userId: string;
  fullName: string;
  role: RoleName;
  permissions: PermissionKey[] | string[];
  mustChangePassword: boolean;
  email?: string;
  phone?: string;
}

export interface AuthPayload {
  user: AuthUser;
}

export interface AdminAccount {
  _id: string;
  id?: string;
  fullName: string;
  userId: string;
  role: RoleName;
  permissions: string[];
  status: "ACTIVE" | "INACTIVE" | "LOCKED";
  email?: string;
  phone?: string;
  lastLoginAt?: string | null;
  createdAt?: string;
  mustChangePassword?: boolean;
}

export interface PermissionOption {
  key: PermissionKey;
  label: string;
}
