import { Schema, model, type InferSchemaType } from "mongoose";

const controlNumberSchema = new Schema(
  {
    controlNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
    status: { type: String, enum: ["PAID", "UNPAID"], required: true, default: "UNPAID" }
  },
  { timestamps: true }
);

controlNumberSchema.index({ createdAt: -1 });

export type ControlNumberDocument = InferSchemaType<typeof controlNumberSchema>;
export const ControlNumber = model("ControlNumber", controlNumberSchema);
