import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  shortDescription: z.string().min(8),
  fullDescription: z.string().optional(),
  icon: z.string().optional(),
  imageUrl: z.string().optional(),
  features: z.array(z.string()).optional(),
  countryAvailability: z.array(z.string()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.number().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
});

export const branchSchema = z.object({
  name: z.string().min(2),
  branchCode: z.string().min(2),
  province: z.string().min(2),
  district: z.string().min(2),
  municipality: z.string().optional(),
  city: z.string().optional(),
  address: z.string().min(4),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  googleMapUrl: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
  weeklyHoliday: z.string().optional(),
  managerName: z.string().optional(),
  servicesAvailable: z.array(z.string()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.number().optional()
});

export const newsSchema = z.object({
  title: z.string().min(3),
  titleNe: z.string().optional(),
  slug: z.string().optional(),
  punchLine: z.string().optional(),
  punchLineNe: z.string().optional(),
  summary: z.string().optional(),
  summaryNe: z.string().optional(),
  content: z.string().optional(),
  contentNe: z.string().optional(),
  featuredImage: z.string().optional(),
  category: z.enum(["NEWS", "NOTICE", "ALERT"]).optional(),
  publishedAt: z.string().optional(),
  author: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
});

export const faqSchema = z.object({
  question: z.string().min(4),
  answer: z.string().min(4),
  category: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.number().optional()
});

export const partnerSchema = z.object({
  name: z.string().min(2),
  logoUrl: z.string().optional(),
  description: z.string().optional(),
  website: z.string().optional(),
  country: z.string().optional(),
  kind: z.enum(["INTERNATIONAL", "NATIONAL"]).optional(),
  nationalType: z.enum(["COOPERATIVE", "PRIVATE_AGENT", "BANK", ""]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.number().optional()
});

export const gallerySchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  category: z.string().optional(),
  imageUrl: z.string().min(1),
  embedUrl: z.string().optional(),
  altText: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.number().optional()
});

export const documentSchema = z.object({
  title: z.string().min(2),
  documentType: z.enum(["LICENSE", "CERTIFICATE", "REGISTRATION", "ANNUAL_REPORT", "POLICY", "OTHER"]).optional(),
  fileUrl: z.string().min(1),
  fileName: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.number().optional()
});

export const pageSchema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  template: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  displayOrder: z.number().optional()
});

export const sectionSchema = z.object({
  key: z.string().min(2),
  type: z.enum([
    "HERO",
    "STATS",
    "SERVICES",
    "RATES",
    "WHY_CHOOSE",
    "NEPAL_MAP",
    "GALLERY",
    "REMITTANCE",
    "PARTNERS",
    "NEWS",
    "TESTIMONIALS",
    "BRANCH_FINDER",
    "CONTACT_CTA",
    "CUSTOM"
  ]),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  backgroundUrl: z.string().optional(),
  overlay: z.boolean().optional(),
  icon: z.string().optional(),
  buttonLabel: z.string().optional(),
  buttonUrl: z.string().optional(),
  secondaryButtonLabel: z.string().optional(),
  secondaryButtonUrl: z.string().optional(),
  alignment: z.enum(["left", "center", "right"]).optional(),
  items: z.unknown().optional(),
  enabled: z.boolean().optional(),
  displayOrder: z.number().optional()
});

export const navigationSchema = z.object({
  label: z.string().min(1),
  path: z.string().min(1),
  enabled: z.boolean().optional(),
  displayOrder: z.number().optional(),
  location: z.enum(["HEADER", "FOOTER"]).optional()
});

export const socialSchema = z.object({
  platform: z.enum(["facebook", "instagram", "linkedin", "youtube", "tiktok", "x", "whatsapp", "other"]),
  label: z.string().min(1),
  url: z.string().url(),
  enabled: z.boolean().optional(),
  displayOrder: z.number().optional()
});

export const teamSchema = z.object({
  name: z.string().min(2),
  title: z.string().min(2),
  group: z.enum(["BOARD", "TEAM"]).optional(),
  tier: z.enum(["LEAD", "STAFF"]).optional(),
  photoUrl: z.string().optional(),
  bio: z.string().optional(),
  displayOrder: z.number().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

export const serviceChargeRowSchema = z.object({
  serial: z.string().optional(),
  sendingAgent: z.string().min(1),
  cashPickup: z.string().optional(),
  bankTransfer: z.string().optional(),
  mergedCharge: z.string().optional(),
  mergePayout: z.boolean().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.number().optional()
});

export const serviceChargePageSchema = z.object({
  pageKicker: z.string().optional(),
  pageTitle: z.string().optional(),
  pageDescription: z.string().optional(),
  footnote: z.string().optional()
});
