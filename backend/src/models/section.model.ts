import { Schema, model, type InferSchemaType } from "mongoose";

const sectionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: [
        "HERO",
        "STATS",
        "SERVICES",
        "RATES",
        "WHY_CHOOSE",
        "NEPAL_MAP",
        "GALLERY",
        "REMITTANCE",
        "PARTNERS",
        "NEWS",
        "TESTIMONIALS",
        "BRANCH_FINDER",
        "CONTACT_CTA",
        "CUSTOM"
      ],
      required: true
    },
    heading: { type: String, default: "" },
    subheading: { type: String, default: "" },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    backgroundUrl: { type: String, default: "" },
    overlay: { type: Boolean, default: true },
    icon: { type: String, default: "" },
    buttonLabel: { type: String, default: "" },
    buttonUrl: { type: String, default: "" },
    secondaryButtonLabel: { type: String, default: "" },
    secondaryButtonUrl: { type: String, default: "" },
    alignment: { type: String, enum: ["left", "center", "right"], default: "left" },
    items: { type: Schema.Types.Mixed, default: [] },
    enabled: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

sectionSchema.index({ enabled: 1, displayOrder: 1 });

export type SectionDocument = InferSchemaType<typeof sectionSchema>;
export const Section = model("Section", sectionSchema);
