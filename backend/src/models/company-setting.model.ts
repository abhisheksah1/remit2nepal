import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const ctaSchema = new Schema(
  {
    label: { type: String, default: "" },
    url: { type: String, default: "" },
    enabled: { type: Boolean, default: true }
  },
  { _id: false }
);

const companySettingSchema = new Schema(
  {
    key: { type: String, default: "default", unique: true },
    companyName: { type: String, required: true },
    tagline: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    officeHours: { type: String, default: "" },
    emergencyContact: { type: String, default: "" },
    headerCta: { type: ctaSchema, default: () => ({}) },
    footerAbout: { type: String, default: "" },
    copyrightText: { type: String, default: "" },
    legalLinks: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true }
      }
    ],
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: "We are performing scheduled maintenance. Please check back shortly." },
    publicRateDisplay: { type: String, enum: ["NRB", "COMPANY", "BOTH"], default: "BOTH" },
    analyticsScript: { type: String, default: "" },
    contactFormEnabled: { type: Boolean, default: true },
    staleRateHours: { type: Number, default: 36 }
  },
  { timestamps: true }
);

export type CompanySettingDocument = InferSchemaType<typeof companySettingSchema> & { _id: Types.ObjectId };
export const CompanySetting = model("CompanySetting", companySettingSchema);
