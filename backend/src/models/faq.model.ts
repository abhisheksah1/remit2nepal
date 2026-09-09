import { Schema, model, type InferSchemaType } from "mongoose";

const faqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: { type: String, default: "General" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

faqSchema.index({ status: 1, category: 1, displayOrder: 1 });
faqSchema.index({ question: "text", answer: "text" });

export type FaqDocument = InferSchemaType<typeof faqSchema>;
export const Faq = model("Faq", faqSchema);
