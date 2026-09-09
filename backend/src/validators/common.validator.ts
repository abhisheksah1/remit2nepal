import { z } from "zod";

export const loginSchema = z.object({
  userId: z.string().min(3).max(64),
  password: z.string().min(1).max(128)
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(12).max(128)
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  q: z.string().optional()
});

export const idParamSchema = z.object({
  id: z.string().min(1)
});

export const adminCreateSchema = z.object({
  fullName: z.string().min(2),
  userId: z.string().min(3).max(64).regex(/^[a-zA-Z0-9._-]+$/),
  password: z.string().min(12),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN"]),
  permissions: z.array(z.string()).default([]),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

export const adminUpdateSchema = adminCreateSchema.partial();

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(4000)
});

export const companyRateSchema = z.object({
  currencyCode: z.string().length(3),
  buyRate: z.number().positive(),
  sellRate: z.number().positive(),
  effectiveDate: z.string().min(8),
  reason: z.string().min(3).max(500)
});

export const currencySchema = z.object({
  code: z.string().length(3),
  name: z.string().min(2),
  symbol: z.string().optional(),
  country: z.string().optional(),
  flag: z.string().optional(),
  decimalPlaces: z.number().int().min(0).max(6).optional(),
  unit: z.number().positive().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.number().optional()
});

export const nrbConfigSchema = z.object({
  enabled: z.boolean().optional(),
  automaticFetchEnabled: z.boolean().optional(),
  fetchFrequencyCron: z.string().optional(),
  retryCount: z.number().int().min(0).max(8).optional(),
  timeoutMs: z.number().int().positive().optional(),
  sourceUrl: z.string().url().optional()
});
