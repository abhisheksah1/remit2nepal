import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const leaveRequestSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: "LeaveEmployee", required: true, index: true },
    leaveType: { type: Schema.Types.ObjectId, ref: "LeaveType", required: true },
    span: { type: String, enum: ["SINGLE", "RANGE"], default: "SINGLE" },
    kind: { type: String, enum: ["PRESENT", "FULL", "HALF", "OVERTIME"], default: "FULL", index: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    days: { type: Number, required: true },
    reason: { type: String, default: "", trim: true },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"], default: "PENDING", index: true },
    reviewNote: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

leaveRequestSchema.index({ fromDate: 1, toDate: 1, status: 1 });

export type LeaveRequestDocument = InferSchemaType<typeof leaveRequestSchema> & { _id: Types.ObjectId };
export const LeaveRequest = model("LeaveRequest", leaveRequestSchema);
