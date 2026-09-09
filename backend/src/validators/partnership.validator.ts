import { z } from "zod";
import { APPLICATION_NATIONAL_TYPES, APPLICATION_STATUSES, PARTNER_KINDS } from "../constants/partnership.js";

const optionalText = z.string().optional().or(z.literal(""));

export const partnerApplicationCreateSchema = z
  .object({
    kind: z.enum(PARTNER_KINDS),
    nationalType: z.enum(APPLICATION_NATIONAL_TYPES).optional().or(z.literal("")),
    companyName: z.string().min(2).max(160),
    ownerName: z.string().min(2).max(120),
    email: z.string().email(),
    fullAddress: z.string().min(8).max(400),
    mobile: z.string().min(7).max(30),
    country: z.string().max(80).optional().or(z.literal("")),
    notes: z.string().max(4000).optional().or(z.literal(""))
  })
  .superRefine((value, ctx) => {
    if (value.kind === "NATIONAL" && value.nationalType !== "COOPERATIVE" && value.nationalType !== "PRIVATE_AGENT") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["nationalType"], message: "Select Cooperative or Private Agent" });
    }
  });

export const partnerApplicationUpdateSchema = z.object({
  status: z.enum(APPLICATION_STATUSES).optional(),
  adminNotes: optionalText
});

export const partnershipSettingsSchema = z.object({
  formEnabled: z.boolean().optional(),
  pageKicker: z.string().min(2).max(80).optional(),
  pageTitle: z.string().min(2).max(160).optional(),
  pageDescription: z.string().min(8).max(800).optional(),
  internationalEnabled: z.boolean().optional(),
  internationalKicker: z.string().max(80).optional(),
  internationalTitle: z.string().max(160).optional(),
  internationalIntro: z.string().max(800).optional(),
  internationalPoints: z.array(z.string().min(2).max(240)).max(12).optional(),
  nationalEnabled: z.boolean().optional(),
  nationalKicker: z.string().max(80).optional(),
  nationalTitle: z.string().max(160).optional(),
  nationalIntro: z.string().max(800).optional(),
  nationalPoints: z.array(z.string().min(2).max(240)).max(12).optional(),
  cooperativeEnabled: z.boolean().optional(),
  cooperativeLabel: z.string().min(2).max(80).optional(),
  privateAgentEnabled: z.boolean().optional(),
  privateAgentLabel: z.string().min(2).max(80).optional(),
  documentLabels: z
    .object({
      companyRegistration: z.string().min(2).max(120).optional(),
      pan: z.string().min(2).max(120).optional(),
      taxClearance: z.string().min(2).max(120).optional(),
      citizenshipBoth: z.string().min(2).max(120).optional(),
      cheque: z.string().min(2).max(120).optional(),
      signedAgreement: z.string().min(2).max(160).optional()
    })
    .optional()
});
