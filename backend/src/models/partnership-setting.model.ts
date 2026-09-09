import { Schema, model, type InferSchemaType } from "mongoose";

const fileMeta = {
  storedName: { type: String, default: "" },
  originalName: { type: String, default: "" },
  mimeType: { type: String, default: "" },
  size: { type: Number, default: 0 }
};

const partnershipSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    formEnabled: { type: Boolean, default: true },
    pageKicker: { type: String, default: "Partnership" },
    pageTitle: { type: String, default: "Become a Partner" },
    pageDescription: {
      type: String,
      default:
        "Join Remit2Nepal as a national agent. Submit full details and documents for verification. After review, the company emails the agreement for signature, stamp, and return by email."
    },
    internationalEnabled: { type: Boolean, default: true },
    internationalKicker: { type: String, default: "Sending corridors" },
    internationalTitle: { type: String, default: "International Partner" },
    internationalIntro: {
      type: String,
      default: "For licensed exchange houses, banks, and money-transfer operators that send remittances into Nepal."
    },
    internationalPoints: {
      type: [String],
      default: [
        "Corridor setup with documented compliance and settlement",
        "NRB-referenced rates published for your sending market",
        "Payout into bank accounts, cash pickup, and partner branches",
        "Relationship desk for operations, limits, and reporting"
      ]
    },
    nationalEnabled: { type: Boolean, default: true },
    nationalKicker: { type: String, default: "Payout network" },
    nationalTitle: { type: String, default: "National Partner" },
    nationalIntro: {
      type: String,
      default: "For cooperatives and private agents across Nepal that deliver funds to families on the last mile."
    },
    nationalPoints: {
      type: [String],
      default: [
        "Choose Cooperative or Private Agent when you apply",
        "Fill the form with full company and owner details",
        "Upload documents for verification first",
        "After review, Remit2Nepal emails the company agreement",
        "Sign, stamp, complete the papers, scan, and email them back"
      ]
    },
    cooperativeEnabled: { type: Boolean, default: true },
    cooperativeLabel: { type: String, default: "Cooperative" },
    privateAgentEnabled: { type: Boolean, default: true },
    privateAgentLabel: { type: String, default: "Private Agent" },
    documentLabels: {
      companyRegistration: { type: String, default: "Register of company" },
      pan: { type: String, default: "PAN" },
      taxClearance: { type: String, default: "Tax clearance" },
      citizenshipBoth: { type: String, default: "Citizenship of both sides" },
      cheque: { type: String, default: "Cheque" },
      signedAgreement: { type: String, default: "Signed and stamped company agreement" }
    },
    agreements: {
      international: fileMeta,
      cooperative: fileMeta,
      privateAgent: fileMeta
    }
  },
  { timestamps: true }
);

export type PartnershipSettingDocument = InferSchemaType<typeof partnershipSettingSchema>;
export const PartnershipSetting = model("PartnershipSetting", partnershipSettingSchema);
