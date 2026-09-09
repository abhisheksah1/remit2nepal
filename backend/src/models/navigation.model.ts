import { Schema, model, type InferSchemaType } from "mongoose";

const navigationSchema = new Schema(
  {
    label: { type: String, required: true },
    path: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    location: { type: String, enum: ["HEADER", "FOOTER"], default: "HEADER" }
  },
  { timestamps: true }
);

navigationSchema.index({ location: 1, displayOrder: 1 });

export type NavigationDocument = InferSchemaType<typeof navigationSchema>;
export const Navigation = model("Navigation", navigationSchema);
