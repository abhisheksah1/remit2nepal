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
    heroImageUrl: { type: String, default: "" },
    heroKicker: { type: String, default: "Our institution" },
    heroTitle: { type: String, default: "" },
    heroDescription: { type: String, default: "" },
    bestOfKicker: { type: String, default: "Best of company" },
    bestOfHeading: { type: String, default: "Best of Remit2Nepal" },
    bestOfSubheading: { type: String, default: "" },
    storyKicker: { type: String, default: "The company" },
    storyHeading: { type: String, default: "Who we are" },
    boardKicker: { type: String, default: "Governance" },
    boardHeading: { type: String, default: "Board of Directors" },
    boardDescription: { type: String, default: "" },
    teamKicker: { type: String, default: "Operations" },
    teamHeading: { type: String, default: "Our Team" },
    teamDescription: { type: String, default: "" },
    teamLeadHeading: { type: String, default: "Managers & top employees" },
    teamStaffHeading: { type: String, default: "Our people" },
    galleryImages: [
      {
        imageUrl: { type: String, required: true },
        title: { type: String, default: "" },
        caption: { type: String, default: "" },
        displayOrder: { type: Number, default: 0 }
      }
    ],
    coreValues: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        icon: { type: String, default: "shield" }
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
