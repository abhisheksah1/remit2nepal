import { z } from "zod";

export const loginSchema = z.object({
  userId: z.string().min(3, "Enter your user ID").max(64),
  password: z.string().min(1, "Enter your password")
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(12, "At least 12 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[a-z]/, "Include a lowercase letter")
      .regex(/\d/, "Include a number")
      .regex(/[^A-Za-z0-9]/, "Include a symbol"),
    confirmPassword: z.string().min(1, "Confirm the new password")
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
