import { Schema, model, type InferSchemaType } from "mongoose";

const exchangeRateSchema = new Schema(
  {
    currency: { type: String, required: true },
    currencyCode: { type: String, required: true, unique: true, uppercase: true },
    unit: { type: Number, required: true, default: 1 },
    nrbBuyRate: { type: Number },
    nrbSellRate: { type: Number },
    officialRate: { type: Number },
    companyBuyRate: { type: Number },
    companySellRate: { type: Number },
    source: { type: String, enum: ["NRB", "MANUAL", "SYSTEM"], default: "NRB" },
    sourceDate: { type: String },
    effectiveDate: { type: Date },
    fetchedAt: { type: Date },
    lastManualUpdateAt: { type: Date },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" }
  },
  { timestamps: true }
);

exchangeRateSchema.index({ status: 1, currencyCode: 1 });
exchangeRateSchema.index({ fetchedAt: -1 });

export type ExchangeRateDocument = InferSchemaType<typeof exchangeRateSchema>;
export const ExchangeRate = model("ExchangeRate", exchangeRateSchema);
