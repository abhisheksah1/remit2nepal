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
    whoBody: { type: String, default: "" },
    whoHighlights: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        icon: { type: String, default: "shield" }
      }
    ],
    missionKicker: { type: String, default: "" },
    missionHeading: { type: String, default: "" },
    missionBody: { type: String, default: "" },
    missionImageUrl: { type: String, default: "" },
    missionPoints: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        icon: { type: String, default: "check" }
      }
    ],
    visionKicker: { type: String, default: "" },
    visionHeading: { type: String, default: "" },
    visionBody: { type: String, default: "" },
    visionImageUrl: { type: String, default: "" },
    visionChips: [{ type: String }],
    whyKicker: { type: String, default: "" },
    whyHeading: { type: String, default: "" },
    whySubheading: { type: String, default: "" },
    whyItems: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        icon: { type: String, default: "shield" }
      }
    ],
    valuesKicker: { type: String, default: "" },
    valuesHeading: { type: String, default: "" },
    valuesSubheading: { type: String, default: "" },
    stepsKicker: { type: String, default: "" },
    stepsHeading: { type: String, default: "" },
    steps: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        icon: { type: String, default: "" }
      }
    ],
    teamAboutKicker: { type: String, default: "" },
    teamAboutHeading: { type: String, default: "" },
    teamAboutIntro: { type: String, default: "" },
    teamAboutBody: { type: String, default: "" },
    teamMotto: { type: String, default: "" },
    teamAboutLinkLabel: { type: String, default: "" },
    teamAboutLinkUrl: { type: String, default: "" },
    commitmentKicker: { type: String, default: "" },
    commitmentHeading: { type: String, default: "" },
    commitmentBody: { type: String, default: "" },
    commitmentItems: [{ type: String }],
    storyBandKicker: { type: String, default: "" },
    storyBandHeading: { type: String, default: "" },
    storyBandBody: { type: String, default: "" },
    storyBandImageUrl: { type: String, default: "" },
    heroPrimaryLabel: { type: String, default: "" },
    heroPrimaryUrl: { type: String, default: "" },
    heroSecondaryLabel: { type: String, default: "" },
    heroSecondaryUrl: { type: String, default: "" },
    ctaHeading: { type: String, default: "" },
    ctaBody: { type: String, default: "" },
    ctaPrimaryLabel: { type: String, default: "" },
    ctaPrimaryUrl: { type: String, default: "" },
    ctaSecondaryLabel: { type: String, default: "" },
    ctaSecondaryUrl: { type: String, default: "" },
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
