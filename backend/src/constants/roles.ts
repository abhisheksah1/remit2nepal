export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN"
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];
