import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const leaveEmployeeSchema = new Schema(
  {
    employeeId: { type: String, required: true, unique: true, trim: true, uppercase: true },
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    designation: { type: String, trim: true, default: "" },
    joinDate: { type: Date, default: Date.now },
    email: { type: String, trim: true, lowercase: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    photoUrl: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" }
  },
  { timestamps: true }
);

leaveEmployeeSchema.index({ department: 1, status: 1 });
leaveEmployeeSchema.index({ name: 1 });

export type LeaveEmployeeDocument = InferSchemaType<typeof leaveEmployeeSchema> & { _id: Types.ObjectId };
export const LeaveEmployee = model("LeaveEmployee", leaveEmployeeSchema);
