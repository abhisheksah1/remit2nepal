import type { Request } from "express";
import { CompanySetting } from "../models/company-setting.model.js";
import { SeoSetting } from "../models/seo-setting.model.js";
import { writeAudit } from "./audit.service.js";
import { AUDIT_ACTIONS } from "../constants/audit-actions.js";
import { NotFoundError } from "../utils/app-error.js";
import { clientIp, userAgent } from "../utils/request-meta.js";

export async function getSettings() {
  const settings = await CompanySetting.findOne({ key: "default" }).lean();
  if (!settings) throw new NotFoundError("Settings not found");
  return settings;
}

export async function updateSettings(input: Record<string, unknown>, req: Request) {
  const settings = await CompanySetting.findOne({ key: "default" });
  if (!settings) throw new NotFoundError("Settings not found");
  const oldValue = settings.toObject();
  const allowed = [
    "companyName",
    "tagline",
    "logoUrl",
    "faviconUrl",
    "phone",
    "email",
    "address",
    "officeHours",
    "emergencyContact",
    "headerCta",
    "footerAbout",
    "copyrightText",
    "legalLinks",
    "maintenanceMode",
    "maintenanceMessage",
    "publicRateDisplay",
    "analyticsScript",
    "contactFormEnabled",
    "staleRateHours"
  ];
  for (const key of allowed) {
    if (key in input) {
      (settings as unknown as Record<string, unknown>)[key] = input[key];
    }
  }
  await settings.save();
  await writeAudit({
    action: AUDIT_ACTIONS.CHANGE_SETTINGS,
    module: "settings",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    oldValue,
    newValue: settings.toObject(),
    ipAddress: clientIp(req),
    userAgent: userAgent(req)
  });
  return settings;
}

export async function getSeo() {
  return SeoSetting.findOne({ key: "global" }).lean();
}

export async function updateSeo(input: Record<string, unknown>, req: Request) {
  const seo = await SeoSetting.findOneAndUpdate({ key: "global" }, input, { new: true, upsert: true });
  await writeAudit({
    action: AUDIT_ACTIONS.CHANGE_SETTINGS,
    module: "seo",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    newValue: seo?.toObject(),
    ipAddress: clientIp(req),
    userAgent: userAgent(req)
  });
  return seo;
}
