import { Schema, model, type InferSchemaType } from "mongoose";

const bannerSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "" },
    body: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    imageRatio: { type: String, enum: ["9:16", "1:1", "16:9"], default: "16:9" },
    altText: { type: String, default: "" },
    kind: { type: String, enum: ["FESTIVAL", "OFFER", "ANNOUNCEMENT", "COOKIE"], default: "OFFER" },
    position: { type: String, enum: ["TOP", "BOTTOM", "LEFT", "RIGHT", "CENTER", "POPUP"], default: "POPUP" },
    pageScope: { type: String, enum: ["ALL", "HOME", "CUSTOM"], default: "ALL" },
    pagePath: { type: String, default: "" },
    linkUrl: { type: String, default: "" },
    buttonLabel: { type: String, default: "" },
    secondaryButtonLabel: { type: String, default: "" },
    frequency: { type: String, enum: ["ONCE", "SESSION", "EVERY_VISIT"], default: "ONCE" },
    dismissible: { type: Boolean, default: true },
    startsAt: { type: Date },
    endsAt: { type: Date },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

bannerSchema.index({ status: 1, position: 1, displayOrder: 1 });
bannerSchema.index({ kind: 1, status: 1 });

export type BannerDocument = InferSchemaType<typeof bannerSchema>;
export const Banner = model("Banner", bannerSchema);
