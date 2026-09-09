import type { AgreementSlot, ApplicationNationalType, NationalPartnerType, PartnerItem } from "@/types/content";

export type PartnerKind = "INTERNATIONAL" | "NATIONAL";

export function resolvePartnerKind(partner: PartnerItem): PartnerKind {
  if (partner.kind === "INTERNATIONAL" || partner.kind === "NATIONAL") return partner.kind;
  return /nepal/i.test(partner.country ?? "") ? "NATIONAL" : "INTERNATIONAL";
}

export function nationalTypeLabel(type?: NationalPartnerType | ApplicationNationalType | "") {
  if (type === "COOPERATIVE") return "Cooperative";
  if (type === "PRIVATE_AGENT") return "Private Agent";
  if (type === "BANK") return "Bank";
  return "";
}

export function groupPartners(partners: PartnerItem[]) {
  const international: PartnerItem[] = [];
  const national: PartnerItem[] = [];
  const cooperative: PartnerItem[] = [];
  const privateAgent: PartnerItem[] = [];
  const bank: PartnerItem[] = [];
  for (const partner of partners) {
    if (resolvePartnerKind(partner) === "INTERNATIONAL") {
      international.push(partner);
      continue;
    }
    national.push(partner);
    if (partner.nationalType === "COOPERATIVE") cooperative.push(partner);
    else if (partner.nationalType === "PRIVATE_AGENT") privateAgent.push(partner);
    else bank.push(partner);
  }
  return { international, national, cooperative, privateAgent, bank };
}

export function agreementSlotFor(kind: PartnerKind, nationalType?: ApplicationNationalType | ""): AgreementSlot {
  if (kind === "INTERNATIONAL") return "international";
  return nationalType === "PRIVATE_AGENT" ? "privateAgent" : "cooperative";
}
