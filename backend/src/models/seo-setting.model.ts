import { Schema, model, type InferSchemaType } from "mongoose";

const seoSettingSchema = new Schema(
  {
    key: { type: String, default: "global", unique: true },
    siteTitle: { type: String, default: "Remit To Nepal Pvt. Ltd" },
    metaDescription: { type: String, default: "" },
    keywords: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    robots: { type: String, default: "index,follow" },
    canonicalUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

export type SeoSettingDocument = InferSchemaType<typeof seoSettingSchema>;
export const SeoSetting = model("SeoSetting", seoSettingSchema);
