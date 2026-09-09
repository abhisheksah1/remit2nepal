import { Schema, model, type InferSchemaType } from "mongoose";

const nrbConfigSchema = new Schema(
  {
    key: { type: String, default: "default", unique: true },
    enabled: { type: Boolean, default: true },
    automaticFetchEnabled: { type: Boolean, default: true },
    fetchFrequencyCron: { type: String, default: "0 */4 * * *" },
    lastSuccessfulFetch: { type: Date },
    lastFailedFetch: { type: Date },
    retryCount: { type: Number, default: 3 },
    timeoutMs: { type: Number, default: 15000 },
    sourceUrl: { type: String, required: true },
    hasApiKey: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export type NrbConfigDocument = InferSchemaType<typeof nrbConfigSchema>;
export const NrbConfig = model("NrbConfig", nrbConfigSchema);
