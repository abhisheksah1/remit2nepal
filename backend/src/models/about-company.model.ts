import { Schema, model, type InferSchemaType } from "mongoose";

const whyItemSchema = {
  title: { type: String, required: true },
  description: { type: String, default: "" },
  icon: { type: String, default: "shield" }
};

const photoSchema = {
  url: { type: String, default: "" },
  alt: { type: String, default: "" },
  overlay: { type: String, default: "" },
  credit: { type: String, default: "" }
};

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
    bestOfHeading: { type: String, default: "Best of Remit To Nepal Pvt. Ltd" },
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
    awards: [{ type: String }],
    compliancePage: {
      seoTitle: { type: String, default: "" },
      seoDescription: { type: String, default: "" },
      heroKicker: { type: String, default: "" },
      heroTitle: { type: String, default: "" },
      heroBody: { type: String, default: "" },
      heroBadge: { type: String, default: "" },
      heroPhoto: photoSchema,
      commitmentKicker: { type: String, default: "" },
      commitmentHeading: { type: String, default: "" },
      commitmentBody: { type: String, default: "" },
      commitmentPhoto: photoSchema,
      commitmentItems: [whyItemSchema],
      kycKicker: { type: String, default: "" },
      kycHeading: { type: String, default: "" },
      kycBody: { type: String, default: "" },
      kycNote: { type: String, default: "" },
      kycPhoto: photoSchema,
      kycPhoto2: photoSchema,
      kycSteps: [whyItemSchema],
      amlKicker: { type: String, default: "" },
      amlHeading: { type: String, default: "" },
      amlBody: { type: String, default: "" },
      amlPhoto: photoSchema,
      amlCards: [whyItemSchema],
      screenKicker: { type: String, default: "" },
      screenHeading: { type: String, default: "" },
      screenBody: { type: String, default: "" },
      screenPhoto: photoSchema,
      screenPills: [{ type: String }],
      fraudKicker: { type: String, default: "" },
      fraudHeading: { type: String, default: "" },
      fraudBody: { type: String, default: "" },
      fraudPhoto: photoSchema,
      fraudCards: [whyItemSchema],
      privacyKicker: { type: String, default: "" },
      privacyHeading: { type: String, default: "" },
      privacyBody: { type: String, default: "" },
      privacyPhoto: photoSchema,
      privacyCards: [whyItemSchema],
      privacyLinkLabel: { type: String, default: "" },
      privacyLinkUrl: { type: String, default: "" },
      protectKicker: { type: String, default: "" },
      protectHeading: { type: String, default: "" },
      protectBody: { type: String, default: "" },
      protectPhoto: photoSchema,
      protectItems: [{ type: String }],
      reportKicker: { type: String, default: "" },
      reportHeading: { type: String, default: "" },
      reportBody: { type: String, default: "" },
      reportPrimaryLabel: { type: String, default: "" },
      reportPrimaryUrl: { type: String, default: "" },
      reportSecondaryLabel: { type: String, default: "" },
      reportSecondaryUrl: { type: String, default: "" },
      teamKicker: { type: String, default: "" },
      teamHeading: { type: String, default: "" },
      teamBody: { type: String, default: "" },
      teamPhoto: photoSchema,
      teamLinkLabel: { type: String, default: "" },
      teamLinkUrl: { type: String, default: "" },
      teamFlow: [{ type: String }],
      regulatorName: { type: String, default: "" },
      regKicker: { type: String, default: "" },
      regHeading: { type: String, default: "" },
      regBody: { type: String, default: "" },
      regNote: { type: String, default: "" },
      regPhoto: photoSchema,
      docsKicker: { type: String, default: "" },
      docsHeading: { type: String, default: "" },
      docsBody: { type: String, default: "" },
      ctaHeading: { type: String, default: "" },
      ctaBody: { type: String, default: "" },
      ctaPrimaryLabel: { type: String, default: "" },
      ctaPrimaryUrl: { type: String, default: "" },
      ctaSecondaryLabel: { type: String, default: "" },
      ctaSecondaryUrl: { type: String, default: "" },
      disabledSections: [{ type: String }]
    }
  },
  { timestamps: true }
);

export type AboutCompanyDocument = InferSchemaType<typeof aboutCompanySchema>;
export const AboutCompany = model("AboutCompany", aboutCompanySchema);
