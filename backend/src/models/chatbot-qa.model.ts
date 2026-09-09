import { Schema, model, type InferSchemaType } from "mongoose";

const chatbotQaSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    keywords: { type: String, default: "", trim: true },
    category: { type: String, default: "General", trim: true },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

chatbotQaSchema.index({ status: 1, displayOrder: 1 });
chatbotQaSchema.index({ question: "text", answer: "text", keywords: "text" });

export type ChatbotQaDocument = InferSchemaType<typeof chatbotQaSchema>;
export const ChatbotQa = model("ChatbotQa", chatbotQaSchema);
