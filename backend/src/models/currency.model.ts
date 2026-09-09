import { Schema, model, type InferSchemaType } from "mongoose";

const currencySchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true },
    symbol: { type: String, default: "" },
    country: { type: String, default: "" },
    flag: { type: String, default: "" },
    decimalPlaces: { type: Number, default: 2 },
    unit: { type: Number, default: 1 },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

currencySchema.index({ status: 1, displayOrder: 1 });

export type CurrencyDocument = InferSchemaType<typeof currencySchema>;
export const Currency = model("Currency", currencySchema);
