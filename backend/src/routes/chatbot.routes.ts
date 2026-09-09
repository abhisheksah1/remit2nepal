import { Router } from "express";
import { chatbotAdmin, chatbotPublic, chatbotQa, chatbotSteps } from "../controllers/chatbot.controller.js";
import { crudRouter } from "./crud.router.js";
import { requirePermission } from "../middlewares/rbac.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { chatbotAskSchema, chatbotQaSchema, chatbotSettingsSchema, chatbotStepSchema } from "../validators/chatbot.validator.js";
import { chatAskRateLimiter } from "../middlewares/rate-limit.middleware.js";

export const chatbotQaRouter = crudRouter(chatbotQa, chatbotQaSchema, "chatbot");
export const chatbotStepRouter = crudRouter(chatbotSteps, chatbotStepSchema, "chatbot");

export const chatbotAdminRouter = Router();
chatbotAdminRouter.use(requirePermission("chatbot"));
chatbotAdminRouter.get("/settings", chatbotAdmin.settings);
chatbotAdminRouter.patch("/settings", validate(chatbotSettingsSchema), chatbotAdmin.updateSettings);
chatbotAdminRouter.get("/knowledge", chatbotAdmin.knowledge);
chatbotAdminRouter.post("/knowledge", upload.single("file"), chatbotAdmin.uploadKnowledge);
chatbotAdminRouter.delete("/knowledge/:id", chatbotAdmin.removeKnowledge);

export const chatbotPublicRouter = Router();
chatbotPublicRouter.get("/", chatbotPublic.config);
chatbotPublicRouter.post("/ask", chatAskRateLimiter, validate(chatbotAskSchema), chatbotPublic.ask);
