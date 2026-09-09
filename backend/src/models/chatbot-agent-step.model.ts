import { Schema, model, type InferSchemaType } from "mongoose";

const chatbotAgentStepSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

chatbotAgentStepSchema.index({ status: 1, displayOrder: 1 });

export type ChatbotAgentStepDocument = InferSchemaType<typeof chatbotAgentStepSchema>;
export const ChatbotAgentStep = model("ChatbotAgentStep", chatbotAgentStepSchema);
