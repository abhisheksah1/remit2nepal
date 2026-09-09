import { Schema, model, type InferSchemaType } from "mongoose";

const serviceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, default: "" },
    icon: { type: String, default: "banknote" },
    imageUrl: { type: String, default: "" },
    features: [{ type: String }],
    countryAvailability: [{ type: String }],
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    displayOrder: { type: Number, default: 0 },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" }
  },
  { timestamps: true }
);

serviceSchema.index({ status: 1, displayOrder: 1 });

export type ServiceDocument = InferSchemaType<typeof serviceSchema>;
export const Service = model("Service", serviceSchema);
