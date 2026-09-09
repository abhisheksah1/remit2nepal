import { Schema, model, type InferSchemaType } from "mongoose";

const serviceChargeRowSchema = new Schema(
  {
    serial: { type: String, default: "", trim: true },
    sendingAgent: { type: String, required: true, trim: true },
    cashPickup: { type: String, default: "", trim: true },
    bankTransfer: { type: String, default: "", trim: true },
    mergedCharge: { type: String, default: "", trim: true },
    mergePayout: { type: Boolean, default: false },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

serviceChargeRowSchema.index({ status: 1, displayOrder: 1 });
serviceChargeRowSchema.index({ sendingAgent: "text", serial: "text" });

const serviceChargePageSchema = new Schema(
  {
    key: { type: String, default: "default", unique: true },
    pageKicker: { type: String, default: "Fees" },
    pageTitle: { type: String, default: "Service Charge" },
    pageDescription: { type: String, default: "" },
    footnote: { type: String, default: "" }
  },
  { timestamps: true }
);

export type ServiceChargeRowDocument = InferSchemaType<typeof serviceChargeRowSchema>;
export type ServiceChargePageDocument = InferSchemaType<typeof serviceChargePageSchema>;
export const ServiceChargeRow = model("ServiceChargeRow", serviceChargeRowSchema);
export const ServiceChargePage = model("ServiceChargePage", serviceChargePageSchema);
