import { ControlNumber } from "../models/control-number.model.js";
import { createResourceService } from "./resource.service.js";
import { NotFoundError } from "../utils/app-error.js";
import type { Request } from "express";

export type TrackStatus = "PAID" | "UNPAID";

export function normalizeControlNumber(value: unknown) {
  return String(value ?? "")
    .trim()
    .toUpperCase();
}

function payload(input: Record<string, unknown>) {
  return {
    controlNumber: normalizeControlNumber(input.controlNumber),
    status: input.status === "PAID" ? "PAID" : "UNPAID"
  };
}

export const remittanceCatalog = createResourceService(ControlNumber, {
  module: "remittances",
  searchFields: ["controlNumber", "status"]
});

export async function createRemittance(input: Record<string, unknown>, req?: Request) {
  return remittanceCatalog.create(payload(input), req);
}

export async function updateRemittance(id: string, input: Record<string, unknown>, req?: Request) {
  return remittanceCatalog.update(id, payload(input), req);
}

export async function lookupControlNumber(controlNumber: string) {
  const code = normalizeControlNumber(controlNumber);
  const record = await ControlNumber.findOne({ controlNumber: code }).lean();
  if (!record) throw new NotFoundError("Invalid control number");
  return {
    controlNumber: record.controlNumber,
    status: record.status as TrackStatus
  };
}
