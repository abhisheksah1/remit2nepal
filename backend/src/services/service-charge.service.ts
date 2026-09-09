import { ServiceChargePage, ServiceChargeRow } from "../models/service-charge.model.js";
import { createResourceService } from "./resource.service.js";
import { writeAudit } from "./audit.service.js";
import { AUDIT_ACTIONS } from "../constants/audit-actions.js";
import type { Request } from "express";

export const serviceChargeCatalog = createResourceService(ServiceChargeRow, {
  module: "services",
  searchFields: ["serial", "sendingAgent", "cashPickup", "bankTransfer", "mergedCharge"]
});

const defaultPage = {
  pageKicker: "Fees",
  pageTitle: "Service Charge",
  pageDescription: "Sending-agent charges for cash pickup and bank transfer.",
  footnote: "Charges are published by sending agents and may change. Confirm the applicable fee before you send."
};

export async function getServiceChargePage() {
  const page = await ServiceChargePage.findOne({ key: "default" }).lean();
  return page ?? { key: "default", ...defaultPage };
}

export async function updateServiceChargePage(input: Record<string, unknown>, req: Request) {
  const page = await ServiceChargePage.findOneAndUpdate({ key: "default" }, input, { new: true, upsert: true });
  await writeAudit({
    action: AUDIT_ACTIONS.UPDATE_WEBSITE,
    module: "services",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    newValue: page?.toObject()
  });
  return page;
}

export async function getPublicServiceCharges() {
  const [page, rows] = await Promise.all([
    getServiceChargePage(),
    ServiceChargeRow.find({ status: "ACTIVE" }).sort({ displayOrder: 1, createdAt: 1 }).lean()
  ]);
  return { page, rows };
}
