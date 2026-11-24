import { Schema, model, type InferSchemaType } from "mongoose";

const leaveRefreshTokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "LeaveTrackerUser", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    rememberMe: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }
  },
  { timestamps: true }
);

export type LeaveRefreshTokenDocument = InferSchemaType<typeof leaveRefreshTokenSchema>;
export const LeaveRefreshToken = model("LeaveRefreshToken", leaveRefreshTokenSchema);
