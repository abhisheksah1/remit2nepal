import { z } from "zod";

export const companyRateSchema = z.object({
  currencyCode: z.string().length(3, "Use a 3-letter code"),
  buyRate: z.coerce.number().positive("Buy rate must be positive"),
  sellRate: z.coerce.number().positive("Sell rate must be positive"),
  effectiveDate: z.string().min(8),
  reason: z.string().min(3).max(500)
});

export const currencyFormSchema = z.object({
  code: z.string().length(3),
  name: z.string().min(2),
  symbol: z.string().optional(),
  country: z.string().optional(),
  flag: z.string().optional(),
  decimalPlaces: z.coerce.number().int().min(0).max(6).optional(),
  unit: z.coerce.number().positive().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.coerce.number().optional()
});

export const nrbConfigSchema = z.object({
  enabled: z.boolean().optional(),
  automaticFetchEnabled: z.boolean().optional(),
  fetchFrequencyCron: z.string().optional(),
  retryCount: z.coerce.number().int().min(0).max(8).optional(),
  timeoutMs: z.coerce.number().int().positive().optional(),
  sourceUrl: z.string().url().optional()
});

export type CompanyRateValues = z.infer<typeof companyRateSchema>;
export type CurrencyFormValues = z.infer<typeof currencyFormSchema>;
export type NrbConfigValues = z.infer<typeof nrbConfigSchema>;
