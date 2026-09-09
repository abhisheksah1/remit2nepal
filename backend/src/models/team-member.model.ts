import { Schema, model, type InferSchemaType } from "mongoose";

const teamMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true },
    photoUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" }
  },
  { timestamps: true }
);

teamMemberSchema.index({ status: 1, displayOrder: 1 });

export type TeamMemberDocument = InferSchemaType<typeof teamMemberSchema>;
export const TeamMember = model("TeamMember", teamMemberSchema);
