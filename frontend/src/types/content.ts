import type { EntityId, PublishStatus, RateDisplayMode, StatusFlag } from "./api";

export interface HeaderCta {
  label: string;
  url: string;
  enabled: boolean;
}

export interface LegalLink {
  label: string;
  url: string;
}

export interface CompanySettings extends EntityId {
  key: string;
  companyName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  phone: string;
  email: string;
  address: string;
  officeHours: string;
  emergencyContact: string;
  headerCta: HeaderCta;
  footerAbout: string;
  copyrightText: string;
  legalLinks: LegalLink[];
  maintenanceMode: boolean;
  maintenanceMessage: string;
  publicRateDisplay: RateDisplayMode;
  analyticsScript: string;
  contactFormEnabled: boolean;
  staleRateHours: number;
}

export interface SeoSettings extends EntityId {
  key: string;
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  faviconUrl: string;
  ogImage: string;
  robots: string;
  canonicalUrl: string;
}

export interface NavItem extends EntityId {
  label: string;
  path: string;
  enabled: boolean;
  displayOrder: number;
  location: "HEADER" | "FOOTER";
}

export interface SocialLink extends EntityId {
  platform: "facebook" | "instagram" | "linkedin" | "youtube" | "tiktok" | "x" | "whatsapp" | "other";
  label: string;
  url: string;
  enabled: boolean;
  displayOrder: number;
}

export type SectionType =
  | "HERO"
  | "STATS"
  | "SERVICES"
  | "RATES"
  | "WHY_CHOOSE"
  | "PARTNERS"
  | "NEWS"
  | "BRANCH_FINDER"
  | "CONTACT_CTA"
  | "CUSTOM";

export interface StatItem {
  label: string;
  value: string;
}

export interface WhyItem {
  title: string;
  description: string;
}

export interface CmsSection extends EntityId {
  key: string;
  type: SectionType;
  heading: string;
  subheading: string;
  description: string;
  imageUrl: string;
  backgroundUrl: string;
  overlay: boolean;
  icon: string;
  buttonLabel: string;
  buttonUrl: string;
  secondaryButtonLabel: string;
  secondaryButtonUrl: string;
  alignment: "left" | "center" | "right";
  items: unknown;
  enabled: boolean;
  displayOrder: number;
}

export interface CmsPage extends EntityId {
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: PublishStatus;
  template: string;
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  displayOrder: number;
}

export interface ServiceItem extends EntityId {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  imageUrl: string;
  features: string[];
  countryAvailability: string[];
  status: StatusFlag;
  displayOrder: number;
  seoTitle: string;
  seoDescription: string;
}

export interface BranchItem extends EntityId {
  name: string;
  branchCode: string;
  province: string;
  district: string;
  municipality: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  googleMapUrl: string;
  latitude?: number;
  longitude?: number;
  openingTime: string;
  closingTime: string;
  weeklyHoliday: string;
  managerName: string;
  servicesAvailable: string[];
  status: StatusFlag;
  displayOrder: number;
}

export interface PartnerItem extends EntityId {
  name: string;
  logoUrl: string;
  description: string;
  website: string;
  country: string;
  status: StatusFlag;
  displayOrder: number;
}

export interface NewsItem extends EntityId {
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage: string;
  category: "NEWS" | "NOTICE" | "ALERT";
  publishedAt?: string | null;
  author: string;
  status: PublishStatus;
  seoTitle: string;
  seoDescription: string;
}

export interface FaqItem extends EntityId {
  question: string;
  answer: string;
  category: string;
  status: StatusFlag;
  displayOrder: number;
}

export interface GalleryItem extends EntityId {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  embedUrl: string;
  altText: string;
  status: StatusFlag;
  displayOrder: number;
}

export interface DocumentItem extends EntityId {
  title: string;
  documentType: "LICENSE" | "CERTIFICATE" | "REGISTRATION" | "ANNUAL_REPORT" | "POLICY" | "OTHER";
  fileUrl: string;
  fileName: string;
  issueDate?: string | null;
  expiryDate?: string | null;
  description: string;
  isPublic: boolean;
  status: StatusFlag;
  displayOrder: number;
}

export interface TeamMember extends EntityId {
  name: string;
  title: string;
  photoUrl: string;
  bio: string;
  displayOrder: number;
  status: StatusFlag;
}

export interface AboutCompany extends EntityId {
  key: string;
  introduction: string;
  mission: string;
  vision: string;
  history: string;
  chairmanMessage: string;
  chairmanName: string;
  chairmanTitle: string;
  chairmanPhotoUrl: string;
  coreValues: WhyItem[];
  statistics: StatItem[];
  certifications: string[];
  licenses: string[];
  awards: string[];
}

export interface ContactMessage extends EntityId {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "NEW" | "READ" | "REPLIED" | "ARCHIVED";
}

export interface MediaItem extends EntityId {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  altText: string;
  folder: string;
}
