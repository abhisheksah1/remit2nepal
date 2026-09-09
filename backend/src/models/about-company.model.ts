import { Schema, model, type InferSchemaType } from "mongoose";

const aboutCompanySchema = new Schema(
  {
    key: { type: String, default: "default", unique: true },
    introduction: { type: String, default: "" },
    mission: { type: String, default: "" },
    vision: { type: String, default: "" },
    history: { type: String, default: "" },
    chairmanMessage: { type: String, default: "" },
    chairmanName: { type: String, default: "" },
    chairmanTitle: { type: String, default: "Chairman" },
    chairmanPhotoUrl: { type: String, default: "" },
    coreValues: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" }
      }
    ],
    statistics: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true }
      }
    ],
    certifications: [{ type: String }],
    licenses: [{ type: String }],
    awards: [{ type: String }]
  },
  { timestamps: true }
);

export type AboutCompanyDocument = InferSchemaType<typeof aboutCompanySchema>;
export const AboutCompany = model("AboutCompany", aboutCompanySchema);
