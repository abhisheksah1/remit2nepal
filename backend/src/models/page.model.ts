import { Schema, model, type InferSchemaType } from "mongoose";

const pageSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String, default: "" },
    content: { type: String, default: "" },
    status: { type: String, enum: ["DRAFT", "PUBLISHED", "ARCHIVED"], default: "DRAFT" },
    template: { type: String, default: "standard" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    ogTitle: { type: String, default: "" },
    ogDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

pageSchema.index({ status: 1, displayOrder: 1 });

export type PageDocument = InferSchemaType<typeof pageSchema>;
export const Page = model("Page", pageSchema);
