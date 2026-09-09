import { Schema, model, type InferSchemaType } from "mongoose";

const partnerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    logoUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    website: { type: String, default: "" },
    country: { type: String, default: "Nepal" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

partnerSchema.index({ status: 1, displayOrder: 1 });
partnerSchema.index({ name: 1 });

export type PartnerDocument = InferSchemaType<typeof partnerSchema>;
export const Partner = model("Partner", partnerSchema);
