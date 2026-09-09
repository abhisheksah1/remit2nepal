import { Schema, model, type InferSchemaType, type Types } from "mongoose";
import type { PermissionKey } from "../constants/permissions.js";
import type { RoleName } from "../constants/roles.js";

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    userId: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    role: { type: String, enum: ["SUPER_ADMIN", "ADMIN"], required: true },
    permissions: [{ type: String, required: true }],
    status: { type: String, enum: ["ACTIVE", "INACTIVE", "LOCKED"], default: "ACTIVE" },
    mustChangePassword: { type: Boolean, default: false },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLoginAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

userSchema.index({ status: 1, role: 1 });
userSchema.index({ email: 1 });

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId };
export type UserPermission = PermissionKey;
export type UserRole = RoleName;

export const User = model("User", userSchema);
