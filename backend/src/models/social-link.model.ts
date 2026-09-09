import { Schema, model, type InferSchemaType } from "mongoose";

const socialLinkSchema = new Schema(
  {
    platform: {
      type: String,
      enum: ["facebook", "instagram", "linkedin", "youtube", "tiktok", "x", "whatsapp", "other"],
      required: true
    },
    label: { type: String, required: true },
    url: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

socialLinkSchema.index({ platform: 1 }, { unique: true });

export type SocialLinkDocument = InferSchemaType<typeof socialLinkSchema>;
export const SocialLink = model("SocialLink", socialLinkSchema);
