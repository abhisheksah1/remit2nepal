import { Schema, model, type InferSchemaType } from "mongoose";

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["NEW", "READ", "REPLIED", "ARCHIVED"], default: "NEW" }
  },
  { timestamps: true }
);

contactMessageSchema.index({ status: 1, createdAt: -1 });
contactMessageSchema.index({ email: 1 });

export type ContactMessageDocument = InferSchemaType<typeof contactMessageSchema>;
export const ContactMessage = model("ContactMessage", contactMessageSchema);
