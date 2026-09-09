import { z } from "zod";

export const adminCreateSchema = z.object({
  fullName: z.string().min(2),
  userId: z.string().min(3).max(64).regex(/^[a-zA-Z0-9._-]+$/, "Letters, numbers, dot, underscore or hyphen"),
  password: z.string().min(12, "At least 12 characters"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  role: z.enum(["SUPER_ADMIN", "ADMIN"]),
  permissions: z.array(z.string()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

export const adminUpdateSchema = z.object({
  fullName: z.string().min(2).optional(),
  userId: z.string().min(3).max(64).optional(),
  password: z.string().min(12).optional().or(z.literal("")),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  role: z.enum(["SUPER_ADMIN", "ADMIN"]).optional(),
  permissions: z.array(z.string()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

export type AdminCreateValues = z.infer<typeof adminCreateSchema>;
export type AdminUpdateValues = z.infer<typeof adminUpdateSchema>;
