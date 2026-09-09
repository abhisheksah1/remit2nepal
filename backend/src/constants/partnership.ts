export const PARTNER_KINDS = ["INTERNATIONAL", "NATIONAL"] as const;
export const NATIONAL_TYPES = ["COOPERATIVE", "PRIVATE_AGENT", "BANK"] as const;
export const APPLICATION_NATIONAL_TYPES = ["COOPERATIVE", "PRIVATE_AGENT"] as const;
export const APPLICATION_STATUSES = ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED"] as const;
export const AGREEMENT_SLOTS = ["international", "cooperative", "privateAgent"] as const;
export const APPLICATION_DOCUMENT_KEYS = [
  "companyRegistration",
  "pan",
  "taxClearance",
  "citizenshipBoth",
  "cheque",
  "signedAgreement"
] as const;

export type PartnerKind = (typeof PARTNER_KINDS)[number];
export type NationalType = (typeof NATIONAL_TYPES)[number];
export type ApplicationNationalType = (typeof APPLICATION_NATIONAL_TYPES)[number];
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type AgreementSlot = (typeof AGREEMENT_SLOTS)[number];
export type ApplicationDocumentKey = (typeof APPLICATION_DOCUMENT_KEYS)[number];

export const DEFAULT_DOCUMENT_LABELS: Record<ApplicationDocumentKey, string> = {
  companyRegistration: "Register of company",
  pan: "PAN",
  taxClearance: "Tax clearance",
  citizenshipBoth: "Citizenship of both sides",
  cheque: "Cheque",
  signedAgreement: "Signed and stamped company agreement"
};
