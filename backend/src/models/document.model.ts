import { Schema, model, type InferSchemaType } from "mongoose";

const documentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    documentType: {
      type: String,
      enum: ["LICENSE", "CERTIFICATE", "REGISTRATION", "ANNUAL_REPORT", "POLICY", "OTHER"],
      default: "OTHER"
    },
    fileUrl: { type: String, required: true },
    fileName: { type: String, default: "" },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    description: { type: String, default: "" },
    isPublic: { type: Boolean, default: false },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

documentSchema.index({ isPublic: 1, status: 1, displayOrder: 1 });

export type DocumentRecord = InferSchemaType<typeof documentSchema>;
export const CompanyDocument = model("Document", documentSchema);
