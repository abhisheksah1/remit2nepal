import { z } from "zod";

const fileRequired = z.custom<File>((value) => value instanceof File && value.size > 0, "This document is required");

export const partnerEnquirySchema = z
  .object({
    kind: z.enum(["INTERNATIONAL", "NATIONAL"]),
    nationalType: z.enum(["COOPERATIVE", "PRIVATE_AGENT", ""]).optional(),
    companyName: z.string().min(2, "Company name is required").max(160),
    ownerName: z.string().min(2, "Owner name is required").max(120),
    email: z.string().email("Enter a valid email"),
    fullAddress: z.string().min(8, "Full address is required").max(400),
    mobile: z.string().min(7, "Mobile number is required").max(30),
    country: z.string().max(80).optional().or(z.literal("")),
    notes: z.string().max(4000).optional().or(z.literal("")),
    companyRegistration: fileRequired,
    pan: fileRequired,
    taxClearance: fileRequired,
    citizenshipBoth: fileRequired,
    cheque: fileRequired,
    signedAgreement: z.custom<File>((value) => value === undefined || (value instanceof File && value.size > 0)).optional()
  })
  .superRefine((value, ctx) => {
    if (value.kind === "NATIONAL" && value.nationalType !== "COOPERATIVE" && value.nationalType !== "PRIVATE_AGENT") {
      ctx.addIssue({ code: "custom", path: ["nationalType"], message: "Select Cooperative or Private Agent" });
    }
  });

export type PartnerEnquiryValues = z.infer<typeof partnerEnquirySchema>;
