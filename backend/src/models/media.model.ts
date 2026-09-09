import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const mediaSchema = new Schema(
  {
    filename: { type: String, required: true, unique: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    altText: { type: String, default: "" },
    folder: { type: String, default: "general" },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

mediaSchema.index({ originalName: 1 });
mediaSchema.index({ createdAt: -1 });

export type MediaDocument = InferSchemaType<typeof mediaSchema> & { _id: Types.ObjectId };
export const Media = model("Media", mediaSchema);
