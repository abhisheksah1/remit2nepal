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
  | "NEPAL_MAP"
  | "GALLERY"
  | "REMITTANCE"
  | "PARTNERS"
  | "NEWS"
  | "TESTIMONIALS"
  | "BRANCH_FINDER"
  | "CONTACT_CTA"
  | "CUSTOM";

export interface TestimonialItem {
  name: string;
  title?: string;
  location?: string;
  headline?: string;
  headlineNe?: string;
  quote: string;
  quoteNe?: string;
  imageUrl?: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface WhyItem {
  title: string;
  description: string;
  icon?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceItem extends EntityId {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  accentColor?: string;
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
  kind?: "INTERNATIONAL" | "NATIONAL";
  nationalType?: "COOPERATIVE" | "PRIVATE_AGENT" | "BANK" | "";
  status: StatusFlag;
  displayOrder: number;
}

export interface NewsItem extends EntityId {
  title: string;
  titleNe?: string;
  slug: string;
  punchLine?: string;
  punchLineNe?: string;
  summary: string;
  summaryNe?: string;
  content: string;
  contentNe?: string;
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

export type RemittanceStatus = "PAID" | "UNPAID";

export interface RemittanceItem extends EntityId {
  controlNumber: string;
  status: RemittanceStatus;
}

export interface ServiceChargeRow extends EntityId {
  serial: string;
  sendingAgent: string;
  cashPickup: string;
  bankTransfer: string;
  mergedCharge: string;
  mergePayout: boolean;
  status: StatusFlag;
  displayOrder: number;
}

export interface ServiceChargePage {
  key?: string;
  pageKicker: string;
  pageTitle: string;
  pageDescription: string;
  footnote: string;
}

export interface PublicServiceCharges {
  page: ServiceChargePage;
  rows: ServiceChargeRow[];
}

export type BannerKind = "FESTIVAL" | "OFFER" | "ANNOUNCEMENT" | "COOKIE";
export type BannerPosition = "TOP" | "BOTTOM" | "LEFT" | "RIGHT" | "CENTER" | "POPUP";
export type BannerPageScope = "ALL" | "HOME" | "CUSTOM";
export type BannerFrequency = "ONCE" | "SESSION" | "EVERY_VISIT";
export type BannerRatio = "9:16" | "1:1" | "16:9";

export interface BannerItem extends EntityId {
  title: string;
  subtitle: string;
  body: string;
  imageUrl: string;
  imageRatio?: BannerRatio;
  altText: string;
  kind: BannerKind;
  position: BannerPosition;
  pageScope: BannerPageScope;
  pagePath: string;
  linkUrl: string;
  buttonLabel: string;
  secondaryButtonLabel: string;
  frequency: BannerFrequency;
  dismissible: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
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

export type TeamGroup = "BOARD" | "TEAM";
export type TeamTier = "LEAD" | "STAFF";

export interface TeamMember extends EntityId {
  name: string;
  title: string;
  group?: TeamGroup;
  tier?: TeamTier;
  photoUrl: string;
  bio: string;
  displayOrder: number;
  status: StatusFlag;
}

export interface AboutGalleryImage {
  imageUrl: string;
  title: string;
  caption: string;
  displayOrder?: number;
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
  heroImageUrl?: string;
  heroKicker?: string;
  heroTitle?: string;
  heroDescription?: string;
  bestOfKicker?: string;
  bestOfHeading?: string;
  bestOfSubheading?: string;
  storyKicker?: string;
  storyHeading?: string;
  boardKicker?: string;
  boardHeading?: string;
  boardDescription?: string;
  teamKicker?: string;
  teamHeading?: string;
  teamDescription?: string;
  teamLeadHeading?: string;
  teamStaffHeading?: string;
  whoBody?: string;
  whoHighlights?: WhyItem[];
  missionKicker?: string;
  missionHeading?: string;
  missionBody?: string;
  missionImageUrl?: string;
  missionPoints?: WhyItem[];
  visionKicker?: string;
  visionHeading?: string;
  visionBody?: string;
  visionImageUrl?: string;
  visionChips?: string[];
  whyKicker?: string;
  whyHeading?: string;
  whySubheading?: string;
  whyItems?: WhyItem[];
  valuesKicker?: string;
  valuesHeading?: string;
  valuesSubheading?: string;
  stepsKicker?: string;
  stepsHeading?: string;
  steps?: WhyItem[];
  teamAboutKicker?: string;
  teamAboutHeading?: string;
  teamAboutIntro?: string;
  teamAboutBody?: string;
  teamMotto?: string;
  teamAboutLinkLabel?: string;
  teamAboutLinkUrl?: string;
  commitmentKicker?: string;
  commitmentHeading?: string;
  commitmentBody?: string;
  commitmentItems?: string[];
  storyBandKicker?: string;
  storyBandHeading?: string;
  storyBandBody?: string;
  storyBandImageUrl?: string;
  heroPrimaryLabel?: string;
  heroPrimaryUrl?: string;
  heroSecondaryLabel?: string;
  heroSecondaryUrl?: string;
  ctaHeading?: string;
  ctaBody?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryUrl?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryUrl?: string;
  galleryImages?: AboutGalleryImage[];
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

export type PartnerKind = "INTERNATIONAL" | "NATIONAL";
export type NationalPartnerType = "COOPERATIVE" | "PRIVATE_AGENT" | "BANK" | "";
export type ApplicationNationalType = "COOPERATIVE" | "PRIVATE_AGENT";
export type PartnerApplicationStatus = "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
export type AgreementSlot = "international" | "cooperative" | "privateAgent";
export type ApplicationDocumentKey =
  | "companyRegistration"
  | "pan"
  | "taxClearance"
  | "citizenshipBoth"
  | "cheque"
  | "signedAgreement";

export interface AgreementMeta {
  available: boolean;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface StoredAgreementFile {
  storedName?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
}

export interface PartnershipDocumentLabels {
  companyRegistration: string;
  pan: string;
  taxClearance: string;
  citizenshipBoth: string;
  cheque: string;
  signedAgreement: string;
}

export interface PublicPartnership {
  formEnabled: boolean;
  pageKicker: string;
  pageTitle: string;
  pageDescription: string;
  internationalEnabled: boolean;
  internationalKicker: string;
  internationalTitle: string;
  internationalIntro: string;
  internationalPoints: string[];
  nationalEnabled: boolean;
  nationalKicker: string;
  nationalTitle: string;
  nationalIntro: string;
  nationalPoints: string[];
  cooperativeEnabled: boolean;
  cooperativeLabel: string;
  privateAgentEnabled: boolean;
  privateAgentLabel: string;
  documentLabels: PartnershipDocumentLabels;
  requiredDocuments: Array<{ key: ApplicationDocumentKey; label: string; required: boolean }>;
  agreements: {
    international: AgreementMeta;
    cooperative: AgreementMeta;
    privateAgent: AgreementMeta;
  };
}

export interface PartnershipSettings extends EntityId {
  key: string;
  formEnabled: boolean;
  pageKicker: string;
  pageTitle: string;
  pageDescription: string;
  internationalEnabled: boolean;
  internationalKicker: string;
  internationalTitle: string;
  internationalIntro: string;
  internationalPoints: string[];
  nationalEnabled: boolean;
  nationalKicker: string;
  nationalTitle: string;
  nationalIntro: string;
  nationalPoints: string[];
  cooperativeEnabled: boolean;
  cooperativeLabel: string;
  privateAgentEnabled: boolean;
  privateAgentLabel: string;
  documentLabels: PartnershipDocumentLabels;
  agreements: {
    international?: StoredAgreementFile;
    cooperative?: StoredAgreementFile;
    privateAgent?: StoredAgreementFile;
  };
}

export interface PartnerApplicationDocument {
  key: ApplicationDocumentKey;
  storedName: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface PartnerApplicationItem extends EntityId {
  kind: PartnerKind;
  nationalType?: ApplicationNationalType | "";
  companyName: string;
  ownerName: string;
  email: string;
  fullAddress: string;
  mobile: string;
  country: string;
  notes: string;
  documents: PartnerApplicationDocument[];
  folderId: string;
  status: PartnerApplicationStatus;
  adminNotes: string;
}

export interface ChatbotSettings {
  enabled: boolean;
  botName: string;
  welcomeMessage: string;
  placeholder: string;
  fallbackMessage: string;
  launcherLabel: string;
  sectionKicker: string;
  sectionTitle: string;
  sectionDescription: string;
  suggestedQuestions: string[];
}

export interface PublicChatbot {
  enabled: boolean;
  botName?: string;
  welcomeMessage?: string;
  placeholder?: string;
  launcherLabel?: string;
  sectionKicker?: string;
  sectionTitle?: string;
  sectionDescription?: string;
  suggestedQuestions?: string[];
  topics?: string[];
  stepTitles?: string[];
}

export interface ChatbotAskLink {
  label: string;
  href: string;
}

export interface ChatbotAgentHit {
  name: string;
  place?: string;
  phone?: string;
  href: string;
}

export interface ChatbotAskResult {
  reply: string;
  source: "qa" | "steps" | "document" | "site" | "fallback";
  sourceLabel: string;
  suggestions: string[];
  links?: ChatbotAskLink[];
  agents?: ChatbotAgentHit[];
}

export interface ChatbotQaItem extends EntityId {
  question: string;
  answer: string;
  keywords: string;
  category: string;
  status: StatusFlag;
  displayOrder: number;
}

export interface ChatbotAgentStep extends EntityId {
  title: string;
  body: string;
  status: StatusFlag;
  displayOrder: number;
}

export interface ChatbotKnowledgeDoc extends EntityId {
  title: string;
  category: "DC_INSTALL" | "AGENT" | "OTHER";
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  pageCount: number;
  chunkCount: number;
  warning: string;
  status: StatusFlag;
}
