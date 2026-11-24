import { AboutCompany } from "../models/about-company.model.js";
import { writeAudit } from "./audit.service.js";
import { AUDIT_ACTIONS } from "../constants/audit-actions.js";
import { sanitizeRichText } from "../utils/sanitize.js";
import type { Request } from "express";

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") return sanitizeRichText(value);
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, nested]) => [key, sanitizeValue(nested)]));
  }
  return value;
}

function sanitizeCompliancePage(page: unknown) {
  return sanitizeValue(page);
}

export async function getAbout() {
  return AboutCompany.findOne({ key: "default" }).lean();
}

export async function updateAbout(input: Record<string, unknown>, req: Request) {
  const rich = [
    "introduction",
    "mission",
    "vision",
    "history",
    "chairmanMessage",
    "whoBody",
    "missionBody",
    "visionBody",
    "teamAboutIntro",
    "teamAboutBody",
    "commitmentBody",
    "storyBandBody",
    "ctaBody",
    "whySubheading",
    "valuesSubheading",
    "heroDescription"
  ];
  const payload = { ...input };
  for (const field of rich) {
    if (typeof payload[field] === "string") payload[field] = sanitizeRichText(payload[field] as string);
  }
  if (payload.compliancePage && typeof payload.compliancePage === "object") {
    payload.compliancePage = sanitizeCompliancePage(payload.compliancePage);
  }
  const about = await AboutCompany.findOneAndUpdate({ key: "default" }, payload, { new: true, upsert: true });
  await writeAudit({
    action: AUDIT_ACTIONS.UPDATE_WEBSITE,
    module: "about",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    newValue: about?.toObject()
  });
  return about;
}
