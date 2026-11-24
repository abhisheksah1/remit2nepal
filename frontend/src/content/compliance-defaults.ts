import type { CompliancePage, CompliancePhotoItem, WhyItem } from "@/types/content";

const photo = (url: string, alt: string, overlay: string, credit: string): CompliancePhotoItem => ({
  url,
  alt,
  overlay,
  credit
});

export const COMPLIANCE_DEFAULTS: Required<
  Pick<
    CompliancePage,
    | "seoTitle"
    | "seoDescription"
    | "heroKicker"
    | "heroTitle"
    | "heroBody"
    | "heroBadge"
    | "heroPhoto"
    | "commitmentKicker"
    | "commitmentHeading"
    | "commitmentBody"
    | "commitmentPhoto"
    | "commitmentItems"
    | "kycKicker"
    | "kycHeading"
    | "kycBody"
    | "kycNote"
    | "kycPhoto"
    | "kycPhoto2"
    | "kycSteps"
    | "amlKicker"
    | "amlHeading"
    | "amlBody"
    | "amlPhoto"
    | "amlCards"
    | "screenKicker"
    | "screenHeading"
    | "screenBody"
    | "screenPhoto"
    | "screenPills"
    | "fraudKicker"
    | "fraudHeading"
    | "fraudBody"
    | "fraudPhoto"
    | "fraudCards"
    | "privacyKicker"
    | "privacyHeading"
    | "privacyBody"
    | "privacyPhoto"
    | "privacyCards"
    | "privacyLinkLabel"
    | "privacyLinkUrl"
    | "protectKicker"
    | "protectHeading"
    | "protectBody"
    | "protectPhoto"
    | "protectItems"
    | "reportKicker"
    | "reportHeading"
    | "reportBody"
    | "reportPrimaryLabel"
    | "reportPrimaryUrl"
    | "reportSecondaryLabel"
    | "reportSecondaryUrl"
    | "teamKicker"
    | "teamHeading"
    | "teamBody"
    | "teamPhoto"
    | "teamLinkLabel"
    | "teamLinkUrl"
    | "teamFlow"
    | "regulatorName"
    | "regKicker"
    | "regHeading"
    | "regBody"
    | "regNote"
    | "regPhoto"
    | "docsKicker"
    | "docsHeading"
    | "docsBody"
    | "ctaHeading"
    | "ctaBody"
    | "ctaPrimaryLabel"
    | "ctaPrimaryUrl"
    | "ctaSecondaryLabel"
    | "ctaSecondaryUrl"
    | "disabledSections"
  >
> = {
  seoTitle: "Compliance & Security | Remit To Nepal Pvt. Ltd",
  seoDescription:
    "How Remit To Nepal Pvt. Ltd approaches compliance, KYC, financial-crime controls, privacy, and customer protection.",
  heroKicker: "Compliance & Security",
  heroTitle: "Compliance You Can // Trust",
  heroBody:
    "We are committed to maintaining high standards of compliance, security, and responsible financial services. Our compliance framework is designed to help protect our customers, prevent financial crime, and support safe and transparent money transfers.",
  heroBadge: "Committed to Safe & Responsible Money Transfers",
  heroPhoto: photo(
    "/images/compliance/nrb-pokhara.jpg",
    "Nepal Rastra Bank office in Pokhara",
    "Nepal Rastra Bank · Pokhara",
    "Photo: Bhupendra Shrestha, Wikimedia Commons, CC BY-SA 4.0"
  ),
  commitmentKicker: "Our commitment",
  commitmentHeading: "Built on Trust. Driven by Responsibility.",
  commitmentBody:
    "Compliance is at the heart of how we operate. We follow applicable laws, regulations, and regulatory requirements in the markets where we provide our services.\n\nOur approach combines technology, trained professionals, monitoring processes, and internal controls to help maintain a safe and responsible remittance environment.",
  commitmentPhoto: photo(
    "/images/compliance/nrb-kathmandu.jpg",
    "Nepal Rastra Bank historical building in Kathmandu",
    "Nepal Rastra Bank · Kathmandu",
    "Photo: Clemensmarabu, Wikimedia Commons, CC BY-SA 3.0"
  ),
  commitmentItems: [
    { title: "Regulatory Compliance", description: "We follow applicable laws and regulatory requirements in the markets where we provide our services.", icon: "scale" },
    { title: "Customer Protection", description: "Controls and processes are designed to help protect customers and keep transfers safer.", icon: "shield" },
    { title: "Financial Crime Prevention", description: "We maintain policies intended to reduce the risk of fraud, money laundering, and other misuse.", icon: "alert" }
  ],
  kycKicker: "Customer verification",
  kycHeading: "Know Your Customer (KYC)",
  kycBody:
    "To help protect our customers and the financial system, we may verify customer identity and other required information before processing certain transactions.\n\nOur verification procedures help us meet applicable regulatory requirements and reduce the risk of fraud, identity theft, money laundering, and other financial crime.",
  kycNote: "Verification requirements may vary depending on the service, transaction, destination, and applicable regulations.",
  kycPhoto: photo(
    "/images/compliance/kyc-verify.jpg",
    "Official documents being reviewed and signed during customer verification",
    "Document review",
    "Photo: Unsplash"
  ),
  kycPhoto2: photo(
    "/images/compliance/identity-scan.jpg",
    "Secure digital payment and identity check",
    "Identity checks",
    "Photo: Unsplash"
  ),
  kycSteps: [
    { title: "Identify", description: "Collect required customer information.", icon: "user" },
    { title: "Verify", description: "Validate information using appropriate verification procedures.", icon: "check" },
    { title: "Protect", description: "Use the information responsibly and securely in accordance with applicable requirements.", icon: "lock" }
  ],
  amlKicker: "AML / CFT",
  amlHeading: "Fighting Financial Crime",
  amlBody:
    "We maintain policies and controls designed to help prevent our services from being misused for money laundering, terrorist financing, fraud, or other prohibited activities.\n\nOur compliance approach may include customer due diligence, transaction monitoring, risk assessment, screening, investigation, and reporting where required by applicable law.",
  amlPhoto: photo(
    "/images/compliance/aml-monitor.jpg",
    "Analyst reviewing financial monitoring dashboards",
    "Transaction monitoring",
    "Photo: Unsplash"
  ),
  amlCards: [
    { title: "Customer Due Diligence", description: "We may review customer information to understand risk and meet applicable due-diligence requirements.", icon: "user" },
    { title: "Transaction Monitoring", description: "Monitoring is designed to help identify unusual or potentially suspicious activity.", icon: "activity" },
    { title: "Risk Assessment", description: "We assess risk so controls can be applied in a proportionate and responsible way.", icon: "alert" },
    { title: "Regulatory Reporting", description: "Where required by applicable law, we report activity through the appropriate channels.", icon: "clipboard" }
  ],
  screenKicker: "Sanctions",
  screenHeading: "Responsible Screening",
  screenBody:
    "We conduct appropriate screening and controls designed to identify transactions or parties that may require additional review under applicable sanctions, regulatory, or internal risk requirements.",
  screenPhoto: photo(
    "/images/compliance/sanctions-review.jpg",
    "Compliance professional reviewing screening records on a laptop",
    "Sanctions & risk review",
    "Photo: Unsplash"
  ),
  screenPills: ["Screening", "Risk Controls", "Review", "Responsible Decisions"],
  fraudKicker: "Fraud prevention",
  fraudHeading: "Protecting You From Fraud",
  fraudBody:
    "We continuously work to identify and reduce fraudulent or suspicious activity. Our security and compliance processes are designed to help protect customers and maintain the integrity of our services.",
  fraudPhoto: photo(
    "/images/compliance/fraud-security.jpg",
    "Cybersecurity systems used to detect fraud and protect customer transfers",
    "Fraud prevention",
    "Photo: Unsplash"
  ),
  fraudCards: [
    { title: "Identity Protection", description: "Measures designed to help protect customer identity.", icon: "fingerprint" },
    { title: "Transaction Monitoring", description: "Monitoring designed to identify unusual or potentially suspicious activity.", icon: "eye" },
    { title: "Security Controls", description: "Technical and operational controls designed to protect systems and information.", icon: "lock" },
    { title: "Customer Awareness", description: "Helping customers recognize suspicious activity and potential scams.", icon: "handshake" }
  ],
  privacyKicker: "Data privacy",
  privacyHeading: "Your Information Matters",
  privacyBody:
    "We respect the privacy of our customers and take appropriate measures to protect personal information. Customer information is handled in accordance with applicable privacy laws, our privacy policies, and legitimate business and regulatory requirements.",
  privacyPhoto: photo(
    "/images/compliance/privacy-data.jpg",
    "Encrypted laptop connection representing customer data protection",
    "Data protection",
    "Photo: Unsplash"
  ),
  privacyCards: [
    { title: "Data Protection", description: "We use appropriate technical and organizational safeguards to protect personal information.", icon: "lock" },
    { title: "Responsible Data Use", description: "Information is collected, used, and retained according to applicable requirements and our published policies.", icon: "search" }
  ],
  privacyLinkLabel: "Read Our Privacy Policy",
  privacyLinkUrl: "/privacy",
  protectKicker: "Customers first",
  protectHeading: "Protecting Our Customers",
  protectBody:
    "Your security and confidence are important to us. We work to provide transparent information about our services, applicable fees, transaction requirements, and security practices.",
  protectPhoto: photo(
    "/images/compliance/customers.jpg",
    "Customer support professional helping a client with a secure transfer",
    "Customer protection",
    "Photo: Unsplash"
  ),
  protectItems: [
    "Clear transaction information",
    "Secure customer verification",
    "Responsible transaction processing",
    "Customer support and assistance"
  ],
  reportKicker: "Need help",
  reportHeading: "See Something Suspicious?",
  reportBody:
    "If you believe a transaction or activity may be fraudulent, suspicious, or unauthorized, please contact our support team as soon as possible.",
  reportPrimaryLabel: "Report an Issue",
  reportPrimaryUrl: "/contact?subject=Report%20a%20suspicious%20activity",
  reportSecondaryLabel: "Contact Support",
  reportSecondaryUrl: "/contact",
  teamKicker: "People",
  teamHeading: "Our Compliance Team",
  teamBody:
    "Our compliance function works across the organization to support responsible operations, identify risks, strengthen controls, and help ensure that our services operate within applicable legal and regulatory requirements.",
  teamPhoto: photo(
    "/images/compliance/team-work.jpg",
    "Professionals collaborating on compliance and customer support",
    "Compliance operations",
    "Photo: Unsplash"
  ),
  teamLinkLabel: "Meet the full team",
  teamLinkUrl: "/about/team",
  teamFlow: ["Compliance", "Risk", "Security", "Operations"],
  regulatorName: "",
  regKicker: "Transparency",
  regHeading: "Regulatory Information",
  regBody:
    "We operate in accordance with the regulatory requirements applicable to our services and the jurisdictions in which we operate.",
  regNote:
    "License numbers, certificates, and additional filings appear here only when they have been published as public documents.",
  regPhoto: photo(
    "/images/compliance/nrb-janakpur.jpg",
    "Nepal Rastra Bank buildings in Janakpur",
    "Nepal Rastra Bank · Janakpur",
    "Photo: Steffen Gauger, Wikimedia Commons, CC BY-SA 3.0"
  ),
  docsKicker: "Documents",
  docsHeading: "Policies & Important Information",
  docsBody: "Read the published policies and service information that apply to our customers.",
  ctaHeading: "// Trust // Is More Than a Promise. It's Our Responsibility.",
  ctaBody:
    "We believe responsible financial services are built on transparency, security, accountability, and continuous improvement. We remain committed to strengthening our compliance practices and protecting the people and communities we serve.",
  ctaPrimaryLabel: "Learn More About Our Policies",
  ctaPrimaryUrl: "#policies",
  ctaSecondaryLabel: "Contact Our Team",
  ctaSecondaryUrl: "/contact",
  disabledSections: []
};

export const COMPLIANCE_SITE_SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "commitment", label: "Commitment" },
  { id: "kyc", label: "KYC" },
  { id: "aml", label: "AML / CFT" },
  { id: "screening", label: "Sanctions" },
  { id: "fraud", label: "Fraud" },
  { id: "privacy", label: "Privacy" },
  { id: "protect", label: "Customers" },
  { id: "report", label: "Report issue" },
  { id: "team", label: "Team" },
  { id: "regulatory", label: "Regulatory" },
  { id: "policies", label: "Policies" },
  { id: "stats", label: "Trust figures" },
  { id: "cta", label: "Closing CTA" }
] as const;

export const COMPLIANCE_ADMIN_SECTIONS = [{ id: "seo", label: "SEO" }, ...COMPLIANCE_SITE_SECTIONS] as const;

export function isComplianceSectionOn(disabledSections: string[] | undefined, id: string) {
  return !(disabledSections ?? []).includes(id);
}

function nonemptyItems(items?: WhyItem[]) {
  return (items ?? []).filter((item) => item.title?.trim());
}

function nonemptyPhoto(value?: CompliancePhotoItem, fallback?: CompliancePhotoItem): CompliancePhotoItem {
  const merged = { ...fallback, ...value };
  if (!merged.url?.trim()) return fallback ?? {};
  return merged;
}

function nonemptyText(value: string | undefined, fallback: string) {
  return value?.trim() ? value : fallback;
}

function nonemptyList(value: string[] | undefined, fallback: string[]) {
  const next = (value ?? []).map((item) => item.trim()).filter(Boolean);
  return next.length ? next : fallback;
}

export function resolveCompliancePage(stored?: CompliancePage): typeof COMPLIANCE_DEFAULTS {
  const d = COMPLIANCE_DEFAULTS;
  return {
    ...d,
    ...stored,
    seoTitle: nonemptyText(stored?.seoTitle, d.seoTitle),
    seoDescription: nonemptyText(stored?.seoDescription, d.seoDescription),
    heroKicker: nonemptyText(stored?.heroKicker, d.heroKicker),
    heroTitle: nonemptyText(stored?.heroTitle, d.heroTitle),
    heroBody: nonemptyText(stored?.heroBody, d.heroBody),
    heroBadge: nonemptyText(stored?.heroBadge, d.heroBadge),
    heroPhoto: nonemptyPhoto(stored?.heroPhoto, d.heroPhoto),
    commitmentKicker: nonemptyText(stored?.commitmentKicker, d.commitmentKicker),
    commitmentHeading: nonemptyText(stored?.commitmentHeading, d.commitmentHeading),
    commitmentBody: nonemptyText(stored?.commitmentBody, d.commitmentBody),
    commitmentPhoto: nonemptyPhoto(stored?.commitmentPhoto, d.commitmentPhoto),
    commitmentItems: nonemptyItems(stored?.commitmentItems).length ? nonemptyItems(stored?.commitmentItems) : d.commitmentItems,
    kycKicker: nonemptyText(stored?.kycKicker, d.kycKicker),
    kycHeading: nonemptyText(stored?.kycHeading, d.kycHeading),
    kycBody: nonemptyText(stored?.kycBody, d.kycBody),
    kycNote: nonemptyText(stored?.kycNote, d.kycNote),
    kycPhoto: nonemptyPhoto(stored?.kycPhoto, d.kycPhoto),
    kycPhoto2: nonemptyPhoto(stored?.kycPhoto2, d.kycPhoto2),
    kycSteps: nonemptyItems(stored?.kycSteps).length ? nonemptyItems(stored?.kycSteps) : d.kycSteps,
    amlKicker: nonemptyText(stored?.amlKicker, d.amlKicker),
    amlHeading: nonemptyText(stored?.amlHeading, d.amlHeading),
    amlBody: nonemptyText(stored?.amlBody, d.amlBody),
    amlPhoto: nonemptyPhoto(stored?.amlPhoto, d.amlPhoto),
    amlCards: nonemptyItems(stored?.amlCards).length ? nonemptyItems(stored?.amlCards) : d.amlCards,
    screenKicker: nonemptyText(stored?.screenKicker, d.screenKicker),
    screenHeading: nonemptyText(stored?.screenHeading, d.screenHeading),
    screenBody: nonemptyText(stored?.screenBody, d.screenBody),
    screenPhoto: nonemptyPhoto(stored?.screenPhoto, d.screenPhoto),
    screenPills: nonemptyList(stored?.screenPills, d.screenPills),
    fraudKicker: nonemptyText(stored?.fraudKicker, d.fraudKicker),
    fraudHeading: nonemptyText(stored?.fraudHeading, d.fraudHeading),
    fraudBody: nonemptyText(stored?.fraudBody, d.fraudBody),
    fraudPhoto: nonemptyPhoto(stored?.fraudPhoto, d.fraudPhoto),
    fraudCards: nonemptyItems(stored?.fraudCards).length ? nonemptyItems(stored?.fraudCards) : d.fraudCards,
    privacyKicker: nonemptyText(stored?.privacyKicker, d.privacyKicker),
    privacyHeading: nonemptyText(stored?.privacyHeading, d.privacyHeading),
    privacyBody: nonemptyText(stored?.privacyBody, d.privacyBody),
    privacyPhoto: nonemptyPhoto(stored?.privacyPhoto, d.privacyPhoto),
    privacyCards: nonemptyItems(stored?.privacyCards).length ? nonemptyItems(stored?.privacyCards) : d.privacyCards,
    privacyLinkLabel: nonemptyText(stored?.privacyLinkLabel, d.privacyLinkLabel),
    privacyLinkUrl: nonemptyText(stored?.privacyLinkUrl, d.privacyLinkUrl),
    protectKicker: nonemptyText(stored?.protectKicker, d.protectKicker),
    protectHeading: nonemptyText(stored?.protectHeading, d.protectHeading),
    protectBody: nonemptyText(stored?.protectBody, d.protectBody),
    protectPhoto: nonemptyPhoto(stored?.protectPhoto, d.protectPhoto),
    protectItems: nonemptyList(stored?.protectItems, d.protectItems),
    reportKicker: nonemptyText(stored?.reportKicker, d.reportKicker),
    reportHeading: nonemptyText(stored?.reportHeading, d.reportHeading),
    reportBody: nonemptyText(stored?.reportBody, d.reportBody),
    reportPrimaryLabel: nonemptyText(stored?.reportPrimaryLabel, d.reportPrimaryLabel),
    reportPrimaryUrl: nonemptyText(stored?.reportPrimaryUrl, d.reportPrimaryUrl),
    reportSecondaryLabel: nonemptyText(stored?.reportSecondaryLabel, d.reportSecondaryLabel),
    reportSecondaryUrl: nonemptyText(stored?.reportSecondaryUrl, d.reportSecondaryUrl),
    teamKicker: nonemptyText(stored?.teamKicker, d.teamKicker),
    teamHeading: nonemptyText(stored?.teamHeading, d.teamHeading),
    teamBody: nonemptyText(stored?.teamBody, d.teamBody),
    teamPhoto: nonemptyPhoto(stored?.teamPhoto, d.teamPhoto),
    teamLinkLabel: nonemptyText(stored?.teamLinkLabel, d.teamLinkLabel),
    teamLinkUrl: nonemptyText(stored?.teamLinkUrl, d.teamLinkUrl),
    teamFlow: nonemptyList(stored?.teamFlow, d.teamFlow),
    regulatorName: stored?.regulatorName ?? d.regulatorName,
    regKicker: nonemptyText(stored?.regKicker, d.regKicker),
    regHeading: nonemptyText(stored?.regHeading, d.regHeading),
    regBody: nonemptyText(stored?.regBody, d.regBody),
    regNote: nonemptyText(stored?.regNote, d.regNote),
    regPhoto: nonemptyPhoto(stored?.regPhoto, d.regPhoto),
    docsKicker: nonemptyText(stored?.docsKicker, d.docsKicker),
    docsHeading: nonemptyText(stored?.docsHeading, d.docsHeading),
    docsBody: nonemptyText(stored?.docsBody, d.docsBody),
    ctaHeading: nonemptyText(stored?.ctaHeading, d.ctaHeading),
    ctaBody: nonemptyText(stored?.ctaBody, d.ctaBody),
    ctaPrimaryLabel: nonemptyText(stored?.ctaPrimaryLabel, d.ctaPrimaryLabel),
    ctaPrimaryUrl: nonemptyText(stored?.ctaPrimaryUrl, d.ctaPrimaryUrl),
    ctaSecondaryLabel: nonemptyText(stored?.ctaSecondaryLabel, d.ctaSecondaryLabel),
    ctaSecondaryUrl: nonemptyText(stored?.ctaSecondaryUrl, d.ctaSecondaryUrl),
    disabledSections: (stored?.disabledSections ?? []).map((item) => item.trim()).filter(Boolean)
  };
}
