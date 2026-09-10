import { z } from "zod";

export const optionalText = z.string().optional().or(z.literal(""));

export const serviceFormSchema = z.object({
  title: z.string().min(2),
  slug: optionalText,
  shortDescription: z.string().min(8),
  fullDescription: optionalText,
  icon: optionalText,
  accentColor: optionalText,
  imageUrl: optionalText,
  features: optionalText,
  countryAvailability: optionalText,
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.coerce.number().optional(),
  seoTitle: optionalText,
  seoDescription: optionalText
});

export const branchFormSchema = z.object({
  name: z.string().min(2),
  branchCode: z.string().min(2),
  province: z.string().min(2),
  district: z.string().min(2),
  municipality: optionalText,
  city: optionalText,
  address: z.string().min(4),
  phone: optionalText,
  email: z.string().email().optional().or(z.literal("")),
  googleMapUrl: optionalText,
  openingTime: optionalText,
  closingTime: optionalText,
  weeklyHoliday: optionalText,
  managerName: optionalText,
  servicesAvailable: optionalText,
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.coerce.number().optional()
});

export const newsFormSchema = z.object({
  title: z.string().min(3),
  titleNe: optionalText,
  slug: optionalText,
  punchLine: optionalText,
  punchLineNe: optionalText,
  summary: optionalText,
  summaryNe: optionalText,
  content: optionalText,
  contentNe: optionalText,
  featuredImage: optionalText,
  category: z.enum(["NEWS", "NOTICE", "ALERT"]).optional(),
  publishedAt: optionalText,
  author: optionalText,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  seoTitle: optionalText,
  seoDescription: optionalText
});

export const faqFormSchema = z.object({
  question: z.string().min(4),
  answer: z.string().min(4),
  category: optionalText,
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.coerce.number().optional()
});

export const remittanceFormSchema = z.object({
  controlNumber: z
    .string()
    .trim()
    .min(4, "Enter a control number")
    .max(40)
    .regex(/^[A-Za-z0-9][A-Za-z0-9-]*$/, "Use letters, numbers, and hyphens only"),
  status: z.enum(["PAID", "UNPAID"])
});

export const partnerFormSchema = z.object({
  name: z.string().min(2),
  logoUrl: optionalText,
  description: optionalText,
  website: optionalText,
  country: optionalText,
  kind: z.enum(["INTERNATIONAL", "NATIONAL"]).optional(),
  nationalType: z.enum(["COOPERATIVE", "PRIVATE_AGENT", "BANK", ""]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.coerce.number().optional()
});

export const galleryFormSchema = z.object({
  title: z.string().min(2),
  description: optionalText,
  category: optionalText,
  imageUrl: z.string().min(1, "Image URL is required"),
  embedUrl: optionalText,
  altText: optionalText,
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.coerce.number().optional()
});

export const documentFormSchema = z.object({
  title: z.string().min(2),
  documentType: z.enum(["LICENSE", "CERTIFICATE", "REGISTRATION", "ANNUAL_REPORT", "POLICY", "OTHER"]).optional(),
  fileUrl: z.string().min(1),
  fileName: optionalText,
  issueDate: optionalText,
  expiryDate: optionalText,
  description: optionalText,
  isPublic: z.boolean().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.coerce.number().optional()
});

export const pageFormSchema = z.object({
  title: z.string().min(2),
  slug: optionalText,
  summary: optionalText,
  content: optionalText,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  template: optionalText,
  seoTitle: optionalText,
  seoDescription: optionalText,
  ogTitle: optionalText,
  ogDescription: optionalText,
  ogImage: optionalText,
  canonicalUrl: optionalText,
  displayOrder: z.coerce.number().optional()
});

export const sectionFormSchema = z.object({
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
  heading: optionalText,
  subheading: optionalText,
  description: optionalText,
  imageUrl: optionalText,
  backgroundUrl: optionalText,
  overlay: z.boolean().optional(),
  icon: optionalText,
  buttonLabel: optionalText,
  buttonUrl: optionalText,
  secondaryButtonLabel: optionalText,
  secondaryButtonUrl: optionalText,
  alignment: z.enum(["left", "center", "right"]).optional(),
  itemsJson: optionalText,
  sceneJson: optionalText,
  pointsJson: optionalText,
  collage1: optionalText,
  collage2: optionalText,
  collage3: optionalText,
  collage4: optionalText,
  cubeWord: optionalText,
  enabled: z.boolean().optional(),
  displayOrder: z.coerce.number().optional()
});

export const navigationFormSchema = z.object({
  label: z.string().min(1),
  path: z.string().min(1),
  enabled: z.boolean().optional(),
  displayOrder: z.coerce.number().optional(),
  location: z.enum(["HEADER", "FOOTER"]).optional()
});

export const socialFormSchema = z.object({
  platform: z.enum(["facebook", "instagram", "linkedin", "youtube", "tiktok", "x", "whatsapp", "other"]),
  label: z.string().min(1),
  url: z.string().url(),
  enabled: z.boolean().optional(),
  displayOrder: z.coerce.number().optional()
});

export const teamFormSchema = z.object({
  name: z.string().min(2),
  title: z.string().min(2),
  group: z.enum(["BOARD", "TEAM"]).optional(),
  tier: z.enum(["LEAD", "STAFF"]).optional(),
  photoUrl: optionalText,
  bio: optionalText,
  displayOrder: z.coerce.number().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

export const serviceChargeRowFormSchema = z.object({
  serial: optionalText,
  sendingAgent: z.string().min(1, "Sending agent is required"),
  cashPickup: optionalText,
  bankTransfer: optionalText,
  mergedCharge: optionalText,
  mergePayout: z.boolean().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.coerce.number().optional()
});

export const serviceChargePageFormSchema = z.object({
  pageKicker: optionalText,
  pageTitle: optionalText,
  pageDescription: optionalText,
  footnote: optionalText
});

export const bannerFormSchema = z
  .object({
    title: z.string().min(2, "Title is required"),
    subtitle: optionalText,
    body: optionalText,
    imageUrl: optionalText,
    imageRatio: z.enum(["9:16", "1:1", "16:9"]).default("16:9"),
    altText: optionalText,
    kind: z.enum(["FESTIVAL", "OFFER", "ANNOUNCEMENT", "COOKIE"]),
    position: z.enum(["TOP", "BOTTOM", "LEFT", "RIGHT", "CENTER", "POPUP"]),
    pageScope: z.enum(["ALL", "HOME", "CUSTOM"]),
    pagePath: optionalText,
    linkUrl: optionalText,
    buttonLabel: optionalText,
    secondaryButtonLabel: optionalText,
    frequency: z.enum(["ONCE", "SESSION", "EVERY_VISIT"]),
    dismissible: z.boolean().optional(),
    startsAt: optionalText,
    endsAt: optionalText,
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    displayOrder: z.coerce.number().optional()
  })
  .superRefine((value, ctx) => {
    if (value.kind !== "COOKIE" && !String(value.imageUrl || "").trim()) {
      ctx.addIssue({ code: "custom", path: ["imageUrl"], message: "Upload the banner design image" });
    }
    if (value.pageScope === "CUSTOM" && !String(value.pagePath || "").trim()) {
      ctx.addIssue({ code: "custom", path: ["pagePath"], message: "Enter the page path, for example /about" });
    }
  });

export const chatbotQaFormSchema = z.object({
  question: z.string().min(4),
  answer: z.string().min(4),
  keywords: optionalText,
  category: optionalText,
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.coerce.number().optional()
});

export const chatbotStepFormSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(8),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.coerce.number().optional()
});
