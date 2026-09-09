import { Schema, model, type InferSchemaType } from "mongoose";
import { APPLICATION_DOCUMENT_KEYS, APPLICATION_NATIONAL_TYPES, APPLICATION_STATUSES, PARTNER_KINDS } from "../constants/partnership.js";

const documentFileSchema = new Schema(
  {
    key: { type: String, enum: APPLICATION_DOCUMENT_KEYS, required: true },
    storedName: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true }
  },
  { _id: false }
);

const partnerApplicationSchema = new Schema(
  {
    kind: { type: String, enum: PARTNER_KINDS, required: true },
    nationalType: { type: String, enum: [...APPLICATION_NATIONAL_TYPES, ""], default: "" },
    companyName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    fullAddress: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    country: { type: String, default: "Nepal", trim: true },
    notes: { type: String, default: "" },
    documents: { type: [documentFileSchema], default: [] },
    folderId: { type: String, required: true },
    status: { type: String, enum: APPLICATION_STATUSES, default: "SUBMITTED" },
    adminNotes: { type: String, default: "" }
  },
  { timestamps: true }
);

partnerApplicationSchema.index({ status: 1, createdAt: -1 });
partnerApplicationSchema.index({ email: 1 });
partnerApplicationSchema.index({ companyName: 1 });

export type PartnerApplicationDocument = InferSchemaType<typeof partnerApplicationSchema>;
export const PartnerApplication = model("PartnerApplication", partnerApplicationSchema);
