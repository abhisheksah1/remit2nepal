import type { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { PartnerApplication } from "../models/partner-application.model.js";
import { PartnershipSetting } from "../models/partnership-setting.model.js";
import { AppError, NotFoundError } from "../utils/app-error.js";
import { stripHtml } from "../utils/sanitize.js";
import { writeAudit } from "./audit.service.js";
import { AUDIT_ACTIONS } from "../constants/audit-actions.js";
import { clientIp, userAgent } from "../utils/request-meta.js";
import { escapeRegex, parsePagination } from "../utils/pagination.js";
import { privateFilePath, removePrivateFile, removePrivateFolder, writePrivateFile } from "./file-store.service.js";
import {
  AGREEMENT_SLOTS,
  APPLICATION_DOCUMENT_KEYS,
  APPLY_DOCUMENT_KEYS,
  DEFAULT_DOCUMENT_LABELS,
  type AgreementSlot,
  type ApplicationDocumentKey
} from "../constants/partnership.js";

const SETTING_FIELDS = [
  "formEnabled",
  "pageKicker",
  "pageTitle",
  "pageDescription",
  "internationalEnabled",
  "internationalKicker",
  "internationalTitle",
  "internationalIntro",
  "internationalPoints",
  "nationalEnabled",
  "nationalKicker",
  "nationalTitle",
  "nationalIntro",
  "nationalPoints",
  "cooperativeEnabled",
  "cooperativeLabel",
  "privateAgentEnabled",
  "privateAgentLabel",
  "documentLabels"
] as const;

function agreementPublic(meta?: { storedName?: string; originalName?: string; mimeType?: string; size?: number } | null) {
  return {
    available: Boolean(meta?.storedName),
    fileName: meta?.originalName || "",
    mimeType: meta?.mimeType || "",
    size: meta?.size || 0
  };
}

function publicSettings(doc: Record<string, unknown>) {
  const agreements = (doc.agreements ?? {}) as Record<string, { storedName?: string; originalName?: string; mimeType?: string; size?: number }>;
  const labels = { ...DEFAULT_DOCUMENT_LABELS, ...((doc.documentLabels as Record<string, string> | undefined) ?? {}) };
  return {
    formEnabled: doc.formEnabled !== false,
    pageKicker: doc.pageKicker,
    pageTitle: doc.pageTitle,
    pageDescription: doc.pageDescription,
    internationalEnabled: doc.internationalEnabled !== false,
    internationalKicker: doc.internationalKicker,
    internationalTitle: doc.internationalTitle,
    internationalIntro: doc.internationalIntro,
    internationalPoints: doc.internationalPoints ?? [],
    nationalEnabled: doc.nationalEnabled !== false,
    nationalKicker: doc.nationalKicker,
    nationalTitle: doc.nationalTitle,
    nationalIntro: doc.nationalIntro,
    nationalPoints: doc.nationalPoints ?? [],
    cooperativeEnabled: doc.cooperativeEnabled !== false,
    cooperativeLabel: doc.cooperativeLabel || "Cooperative",
    privateAgentEnabled: doc.privateAgentEnabled !== false,
    privateAgentLabel: doc.privateAgentLabel || "Private Agent",
    documentLabels: labels,
    requiredDocuments: APPLICATION_DOCUMENT_KEYS.map((key) => ({
      key,
      label: labels[key],
      required: key !== "signedAgreement"
    })),
    agreements: {
      international: agreementPublic(agreements.international),
      cooperative: agreementPublic(agreements.cooperative),
      privateAgent: agreementPublic(agreements.privateAgent)
    }
  };
}

export async function getPartnershipSettings() {
  let settings = await PartnershipSetting.findOne({ key: "default" });
  if (!settings) {
    settings = await PartnershipSetting.create({ key: "default" });
  }
  return settings;
}

export async function getPublicPartnership() {
  const settings = await getPartnershipSettings();
  return publicSettings(settings.toObject() as Record<string, unknown>);
}

export async function updatePartnershipSettings(input: Record<string, unknown>, req: Request) {
  const settings = await getPartnershipSettings();
  const oldValue = settings.toObject();
  for (const key of SETTING_FIELDS) {
    if (!(key in input)) continue;
    if (key === "documentLabels") {
      settings.documentLabels = {
        ...DEFAULT_DOCUMENT_LABELS,
        ...settings.toObject().documentLabels,
        ...(input.documentLabels as Partial<typeof DEFAULT_DOCUMENT_LABELS>)
      };
      continue;
    }
    (settings as unknown as Record<string, unknown>)[key] = input[key];
  }
  await settings.save();
  await writeAudit({
    action: AUDIT_ACTIONS.CHANGE_SETTINGS,
    module: "partners",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    oldValue,
    newValue: settings.toObject(),
    ipAddress: clientIp(req),
    userAgent: userAgent(req)
  });
  return settings;
}

export function parseAgreementSlot(value: string | undefined): AgreementSlot {
  if (!value || !AGREEMENT_SLOTS.includes(value as AgreementSlot)) {
    throw new AppError("Unknown agreement type", 400);
  }
  return value as AgreementSlot;
}

export async function uploadPartnershipAgreement(slot: AgreementSlot, file: Express.Multer.File, req: Request) {
  const settings = await getPartnershipSettings();
  const previous = settings.agreements?.[slot];
  const stored = await writePrivateFile("agreements", file);
  settings.set(`agreements.${slot}`, stored);
  await settings.save();
  if (previous?.storedName && previous.storedName !== stored.storedName) {
    await removePrivateFile("agreements", previous.storedName);
  }
  await writeAudit({
    action: AUDIT_ACTIONS.UPLOAD_MEDIA,
    module: "partners",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    newValue: { slot, originalName: stored.originalName },
    ipAddress: clientIp(req),
    userAgent: userAgent(req)
  });
  return settings;
}

export async function streamPartnershipAgreement(slot: AgreementSlot, res: Response) {
  const settings = await getPartnershipSettings();
  const meta = settings.agreements?.[slot];
  if (!meta?.storedName) {
    throw new NotFoundError("Agreement has not been uploaded yet");
  }
  const filePath = privateFilePath("agreements", meta.storedName);
  res.setHeader("Content-Type", meta.mimeType || "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(meta.originalName || "agreement.pdf")}"`);
  res.sendFile(filePath);
}

function filesFromRequest(req: Request) {
  const raw = req.files;
  if (!raw || Array.isArray(raw)) return {} as Record<string, Express.Multer.File>;
  const map: Record<string, Express.Multer.File> = {};
  for (const key of APPLICATION_DOCUMENT_KEYS) {
    const first = raw[key]?.[0];
    if (first) map[key] = first;
  }
  return map;
}

export async function submitPartnerApplication(input: Record<string, string>, req: Request) {
  const settings = await getPartnershipSettings();
  if (settings.formEnabled === false) {
    throw new AppError("Partnership applications are temporarily closed", 403);
  }
  if (input.kind === "INTERNATIONAL" && !settings.internationalEnabled) {
    throw new AppError("International partnership is not open", 400);
  }
  if (input.kind === "NATIONAL" && !settings.nationalEnabled) {
    throw new AppError("National partnership is not open", 400);
  }
  if (input.kind === "NATIONAL" && input.nationalType === "COOPERATIVE" && !settings.cooperativeEnabled) {
    throw new AppError("Cooperative applications are not open", 400);
  }
  if (input.kind === "NATIONAL" && input.nationalType === "PRIVATE_AGENT" && !settings.privateAgentEnabled) {
    throw new AppError("Private agent applications are not open", 400);
  }

  const files = filesFromRequest(req);
  const missing = APPLY_DOCUMENT_KEYS.filter((key) => !files[key]);
  if (missing.length) {
    throw new AppError("All required documents must be uploaded", 400, missing.map((field) => ({ field, message: "This document is required" })));
  }

  const folderId = uuid();
  const documents: Array<{
    key: ApplicationDocumentKey;
    storedName: string;
    originalName: string;
    mimeType: string;
    size: number;
  }> = [];

  try {
    for (const key of APPLICATION_DOCUMENT_KEYS) {
      const file = files[key];
      if (!file) continue;
      const stored = await writePrivateFile(`partner-applications/${folderId}`, file);
      documents.push({ key, ...stored });
    }
  } catch (error) {
    await removePrivateFolder(`partner-applications/${folderId}`);
    throw error;
  }

  const application = await PartnerApplication.create({
    kind: input.kind,
    nationalType: input.kind === "NATIONAL" ? input.nationalType : "",
    companyName: stripHtml(input.companyName ?? ""),
    ownerName: stripHtml(input.ownerName ?? ""),
    email: stripHtml(input.email ?? "").toLowerCase(),
    fullAddress: stripHtml(input.fullAddress ?? ""),
    mobile: stripHtml(input.mobile ?? ""),
    country: stripHtml(input.country || (input.kind === "NATIONAL" ? "Nepal" : "")),
    notes: stripHtml(input.notes || ""),
    documents,
    folderId,
    status: "SUBMITTED"
  });

  return { id: String(application._id), status: application.status };
}

export async function listPartnerApplications(page = 1, limit = 20, search?: string, status?: string) {
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (search) {
    const rx = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ companyName: rx }, { ownerName: rx }, { email: rx }, { mobile: rx }];
  }
  const safe = parsePagination({ page, limit });
  const [items, total] = await Promise.all([
    PartnerApplication.find(filter).sort({ createdAt: -1 }).skip((safe.page - 1) * safe.limit).limit(safe.limit).lean(),
    PartnerApplication.countDocuments(filter)
  ]);
  return { items, total, page: safe.page, limit: safe.limit };
}

export async function getPartnerApplication(id: string) {
  const item = await PartnerApplication.findById(id).lean();
  if (!item) throw new NotFoundError("Application not found");
  return item;
}

export async function updatePartnerApplication(id: string, input: { status?: string; adminNotes?: string }, req: Request) {
  const item = await PartnerApplication.findById(id);
  if (!item) throw new NotFoundError("Application not found");
  const oldValue = item.toObject();
  if (input.status) item.status = input.status as typeof item.status;
  if (input.adminNotes !== undefined) item.adminNotes = stripHtml(input.adminNotes);
  await item.save();
  await writeAudit({
    action: AUDIT_ACTIONS.UPDATE,
    module: "partners",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    entityId: id,
    oldValue,
    newValue: item.toObject(),
    ipAddress: clientIp(req),
    userAgent: userAgent(req)
  });
  return item;
}

export async function deletePartnerApplication(id: string, req: Request) {
  const item = await PartnerApplication.findById(id);
  if (!item) throw new NotFoundError("Application not found");
  await removePrivateFolder(`partner-applications/${item.folderId}`);
  await item.deleteOne();
  await writeAudit({
    action: AUDIT_ACTIONS.DELETE,
    module: "partners",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    entityId: id,
    oldValue: { companyName: item.companyName, email: item.email },
    ipAddress: clientIp(req),
    userAgent: userAgent(req)
  });
}

export async function streamApplicationDocument(id: string, key: string, res: Response) {
  if (!APPLICATION_DOCUMENT_KEYS.includes(key as ApplicationDocumentKey)) {
    throw new AppError("Unknown document", 400);
  }
  const item = await PartnerApplication.findById(id);
  if (!item) throw new NotFoundError("Application not found");
  const doc = item.documents.find((entry) => entry.key === key);
  if (!doc) throw new NotFoundError("Document not found");
  const filePath = privateFilePath(`partner-applications/${item.folderId}`, doc.storedName);
  res.setHeader("Content-Type", doc.mimeType || "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(doc.originalName)}"`);
  res.sendFile(filePath);
}
