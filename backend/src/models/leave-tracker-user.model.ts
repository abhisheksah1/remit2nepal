import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const leaveTrackerUserSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    userId: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    email: { type: String, trim: true, lowercase: true, default: "" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE", "LOCKED"], default: "ACTIVE" },
    mustChangePassword: { type: Boolean, default: false },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLoginAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

leaveTrackerUserSchema.index({ status: 1 });

export type LeaveTrackerUserDocument = InferSchemaType<typeof leaveTrackerUserSchema> & { _id: Types.ObjectId };
export const LeaveTrackerUser = model("LeaveTrackerUser", leaveTrackerUserSchema);
