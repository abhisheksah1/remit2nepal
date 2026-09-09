import { Schema, model, type InferSchemaType } from "mongoose";

const exchangeRateHistorySchema = new Schema(
  {
    currency: { type: String, required: true },
    currencyCode: { type: String, required: true, uppercase: true },
    unit: { type: Number, required: true, default: 1 },
    previousBuyRate: { type: Number },
    previousSellRate: { type: Number },
    buyRate: { type: Number, required: true },
    sellRate: { type: Number, required: true },
    officialRate: { type: Number },
    changeBuy: { type: Number, default: 0 },
    changeSell: { type: Number, default: 0 },
    source: { type: String, required: true },
    sourceDate: { type: String },
    effectiveDate: { type: Date, required: true },
    fetchedAt: { type: Date },
    changeType: { type: String, enum: ["NRB_IMPORT", "MANUAL_UPDATE", "SYSTEM_SYNC"], required: true },
    rateKind: { type: String, enum: ["NRB", "COMPANY"], required: true },
    changedBy: { type: String, default: "system" },
    reason: { type: String, default: "" },
    sourceHash: { type: String, required: true },
    status: { type: String, default: "ACTIVE" }
  },
  { timestamps: true }
);

exchangeRateHistorySchema.index(
  { currencyCode: 1, sourceDate: 1, changeType: 1, rateKind: 1, sourceHash: 1 },
  { unique: true }
);
exchangeRateHistorySchema.index({ currencyCode: 1, effectiveDate: -1 });
exchangeRateHistorySchema.index({ createdAt: -1 });

export type ExchangeRateHistoryDocument = InferSchemaType<typeof exchangeRateHistorySchema>;
export const ExchangeRateHistory = model("ExchangeRateHistory", exchangeRateHistorySchema);
