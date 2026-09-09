import { Schema, model, type InferSchemaType } from "mongoose";

const permissionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    module: { type: String, required: true }
  },
  { timestamps: true }
);

export type PermissionDocument = InferSchemaType<typeof permissionSchema>;
export const Permission = model("Permission", permissionSchema);
