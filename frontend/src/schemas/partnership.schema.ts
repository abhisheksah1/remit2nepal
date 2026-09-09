import { z } from "zod";

export const partnershipSettingsFormSchema = z.object({
  formEnabled: z.boolean(),
  pageKicker: z.string().min(2),
  pageTitle: z.string().min(2),
  pageDescription: z.string().min(8),
  internationalEnabled: z.boolean(),
  internationalKicker: z.string().min(1),
  internationalTitle: z.string().min(2),
  internationalIntro: z.string().min(8),
  internationalPointsText: z.string().min(2),
  nationalEnabled: z.boolean(),
  nationalKicker: z.string().min(1),
  nationalTitle: z.string().min(2),
  nationalIntro: z.string().min(8),
  nationalPointsText: z.string().min(2),
  cooperativeEnabled: z.boolean(),
  cooperativeLabel: z.string().min(2),
  privateAgentEnabled: z.boolean(),
  privateAgentLabel: z.string().min(2),
  labelCompanyRegistration: z.string().min(2),
  labelPan: z.string().min(2),
  labelTaxClearance: z.string().min(2),
  labelCitizenshipBoth: z.string().min(2),
  labelCheque: z.string().min(2),
  labelSignedAgreement: z.string().min(2)
});

export type PartnershipSettingsForm = z.infer<typeof partnershipSettingsFormSchema>;
