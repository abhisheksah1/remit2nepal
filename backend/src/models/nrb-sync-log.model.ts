import { Schema, model, type InferSchemaType } from "mongoose";

const nrbSyncLogSchema = new Schema(
  {
    status: { type: String, enum: ["SUCCESS", "PARTIAL", "FAILED"], required: true },
    sourceUrl: { type: String, required: true },
    sourceDate: { type: String },
    currenciesUpdated: { type: Number, default: 0 },
    recordsCreated: { type: Number, default: 0 },
    message: { type: String, default: "" },
    error: { type: String, default: "" },
    durationMs: { type: Number, default: 0 },
    triggeredBy: { type: String, default: "scheduler" }
  },
  { timestamps: true }
);

nrbSyncLogSchema.index({ createdAt: -1 });
nrbSyncLogSchema.index({ status: 1, createdAt: -1 });

export type NrbSyncLogDocument = InferSchemaType<typeof nrbSyncLogSchema>;
export const NrbSyncLog = model("NrbSyncLog", nrbSyncLogSchema);
