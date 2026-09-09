import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(120),
  email: z.string().email("Enter a valid email"),
  phone: z.string().max(30).optional().or(z.literal("")),
  subject: z.string().min(3, "Subject is required").max(200),
  message: z.string().min(10, "Please write at least 10 characters").max(4000)
});

export type ContactValues = z.infer<typeof contactSchema>;
