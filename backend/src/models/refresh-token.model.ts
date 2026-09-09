import { Schema, model, type InferSchemaType } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date }
  },
  { timestamps: true }
);

refreshTokenSchema.index({ tokenHash: 1 }, { unique: true });
refreshTokenSchema.index({ user: 1, expiresAt: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type RefreshTokenDocument = InferSchemaType<typeof refreshTokenSchema>;
export const RefreshToken = model("RefreshToken", refreshTokenSchema);
