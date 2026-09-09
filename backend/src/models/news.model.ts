import { Schema, model, type InferSchemaType } from "mongoose";

const newsSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    summary: { type: String, default: "" },
    content: { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    category: { type: String, enum: ["NEWS", "NOTICE", "ALERT"], default: "NEWS" },
    publishedAt: { type: Date },
    author: { type: String, default: "" },
    status: { type: String, enum: ["DRAFT", "PUBLISHED", "ARCHIVED"], default: "DRAFT" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" }
  },
  { timestamps: true }
);

newsSchema.index({ status: 1, category: 1, publishedAt: -1 });

export type NewsDocument = InferSchemaType<typeof newsSchema>;
export const News = model("News", newsSchema);
