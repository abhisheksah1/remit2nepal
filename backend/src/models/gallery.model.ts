import { Schema, model, type InferSchemaType } from "mongoose";

const gallerySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, default: "General" },
    imageUrl: { type: String, required: true },
    embedUrl: { type: String, default: "" },
    altText: { type: String, default: "" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

gallerySchema.index({ status: 1, displayOrder: 1 });

export type GalleryDocument = InferSchemaType<typeof gallerySchema>;
export const Gallery = model("Gallery", gallerySchema);
