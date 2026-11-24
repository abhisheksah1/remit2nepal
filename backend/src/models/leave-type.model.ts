import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const leaveTypeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    daysAllowed: { type: Number, required: true, min: 0, default: 0 },
    paid: { type: Boolean, default: true },
    color: { type: String, default: "#2E3192" },
    description: { type: String, default: "", trim: true },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" }
  },
  { timestamps: true }
);

export type LeaveTypeDocument = InferSchemaType<typeof leaveTypeSchema> & { _id: Types.ObjectId };
export const LeaveType = model("LeaveType", leaveTypeSchema);
