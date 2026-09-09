import { Schema, model, type InferSchemaType } from "mongoose";

const chatbotKnowledgeDocSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: ["DC_INSTALL", "AGENT", "OTHER"], default: "DC_INSTALL" },
    originalName: { type: String, default: "" },
    storedName: { type: String, default: "" },
    mimeType: { type: String, default: "" },
    size: { type: Number, default: 0 },
    pageCount: { type: Number, default: 0 },
    chunkCount: { type: Number, default: 0 },
    warning: { type: String, default: "" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" }
  },
  { timestamps: true }
);

chatbotKnowledgeDocSchema.index({ status: 1, category: 1 });

const chatbotKnowledgeChunkSchema = new Schema(
  {
    docId: { type: Schema.Types.ObjectId, ref: "ChatbotKnowledgeDoc", required: true, index: true },
    title: { type: String, default: "" },
    category: { type: String, default: "DC_INSTALL" },
    page: { type: Number, default: 1 },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

chatbotKnowledgeChunkSchema.index({ text: "text", title: "text" });

export type ChatbotKnowledgeDocDocument = InferSchemaType<typeof chatbotKnowledgeDocSchema>;
export type ChatbotKnowledgeChunkDocument = InferSchemaType<typeof chatbotKnowledgeChunkSchema>;
export const ChatbotKnowledgeDoc = model("ChatbotKnowledgeDoc", chatbotKnowledgeDocSchema);
export const ChatbotKnowledgeChunk = model("ChatbotKnowledgeChunk", chatbotKnowledgeChunkSchema);
