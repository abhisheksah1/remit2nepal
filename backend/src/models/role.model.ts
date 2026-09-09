import { Schema, model, type InferSchemaType } from "mongoose";

const roleSchema = new Schema(
  {
    name: { type: String, enum: ["SUPER_ADMIN", "ADMIN"], required: true, unique: true },
    description: { type: String, required: true },
    isSystem: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export type RoleDocument = InferSchemaType<typeof roleSchema>;
export const Role = model("Role", roleSchema);
