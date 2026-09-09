import { Schema, model, type InferSchemaType } from "mongoose";

const auditLogSchema = new Schema(
  {
    userId: { type: String, default: "system" },
    userName: { type: String, default: "system" },
    action: { type: String, required: true },
    module: { type: String, required: true },
    entityId: { type: String, default: "" },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" }
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ module: 1, action: 1, createdAt: -1 });

export type AuditLogDocument = InferSchemaType<typeof auditLogSchema>;
export const AuditLog = model("AuditLog", auditLogSchema);
