import { Schema, model, type InferSchemaType } from "mongoose";

const branchSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    branchCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    municipality: { type: String, default: "" },
    city: { type: String, default: "" },
    address: { type: String, required: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    googleMapUrl: { type: String, default: "" },
    latitude: { type: Number },
    longitude: { type: Number },
    openingTime: { type: String, default: "10:00" },
    closingTime: { type: String, default: "17:00" },
    weeklyHoliday: { type: String, default: "Saturday" },
    managerName: { type: String, default: "" },
    servicesAvailable: [{ type: String }],
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

branchSchema.index({ province: 1, district: 1, city: 1 });
branchSchema.index({ name: 1, district: 1 });
branchSchema.index({ name: "text", city: "text", district: "text", address: "text" });
branchSchema.index({ status: 1, displayOrder: 1 });

export type BranchDocument = InferSchemaType<typeof branchSchema>;
export const Branch = model("Branch", branchSchema);
