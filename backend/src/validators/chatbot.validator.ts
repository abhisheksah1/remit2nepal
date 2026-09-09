import { z } from "zod";

export const chatbotSettingsSchema = z.object({
  enabled: z.boolean().optional(),
  botName: z.string().min(2).max(80).optional(),
  welcomeMessage: z.string().min(8).max(800).optional(),
  placeholder: z.string().min(4).max(160).optional(),
  fallbackMessage: z.string().min(8).max(800).optional(),
  launcherLabel: z.string().min(2).max(40).optional(),
  sectionKicker: z.string().min(2).max(40).optional(),
  sectionTitle: z.string().min(2).max(120).optional(),
  sectionDescription: z.string().min(8).max(400).optional(),
  suggestedQuestions: z.array(z.string().min(3).max(160)).max(12).optional()
});

export const chatbotQaSchema = z.object({
  question: z.string().min(4).max(240),
  answer: z.string().min(4).max(4000),
  keywords: z.string().max(400).optional(),
  category: z.string().max(40).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.coerce.number().int().optional()
});

export const chatbotStepSchema = z.object({
  title: z.string().min(3).max(160),
  body: z.string().min(8).max(4000),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.coerce.number().int().optional()
});

export const chatbotAskSchema = z.object({
  message: z.string().min(2).max(500)
});

export const chatbotKnowledgeMetaSchema = z.object({
  title: z.string().min(2).max(160).optional(),
  category: z.enum(["DC_INSTALL", "AGENT", "OTHER"]).optional()
});
