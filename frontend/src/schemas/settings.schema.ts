import { z } from "zod";

export const settingsFormSchema = z.object({
  companyName: z.string().min(2),
  tagline: z.string().optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  officeHours: z.string().optional(),
  emergencyContact: z.string().optional(),
  headerCtaLabel: z.string().optional(),
  headerCtaUrl: z.string().optional(),
  headerCtaEnabled: z.boolean().optional(),
  footerAbout: z.string().optional(),
  copyrightText: z.string().optional(),
  maintenanceMode: z.boolean().optional(),
  maintenanceMessage: z.string().optional(),
  publicRateDisplay: z.enum(["NRB", "COMPANY", "BOTH"]).optional(),
  analyticsScript: z.string().optional(),
  contactFormEnabled: z.boolean().optional(),
  staleRateHours: z.coerce.number().min(1).max(168).optional()
});

export const seoFormSchema = z.object({
  siteTitle: z.string().min(2),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  faviconUrl: z.string().optional(),
  ogImage: z.string().optional(),
  robots: z.string().optional(),
  canonicalUrl: z.string().optional()
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
export type SeoFormValues = z.infer<typeof seoFormSchema>;
