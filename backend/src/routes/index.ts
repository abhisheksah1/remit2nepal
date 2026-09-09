import { Router } from "express";
import { publicApi } from "../controllers/cms.controller.js";
import { authRouter } from "./auth.routes.js";
import { adminRouter } from "./admin.routes.js";
import { auditRouter, dashboardRouter, seoRouter, settingsRouter } from "./ops.routes.js";
import { exchangeRateRouter, nrbRouter } from "./exchange-rate.routes.js";
import {
  aboutRouter,
  branchRouter,
  contactRouter,
  documentRouter,
  faqRouter,
  galleryRouter,
  mediaRouter,
  navigationRouter,
  newsRouter,
  pageRouter,
  partnerApplicationRouter,
  partnerRouter,
  partnershipSettingsRouter,
  sectionRouter,
  serviceChargeRouter,
  serviceRouter,
  socialRouter,
  teamRouter
} from "./cms.routes.js";
import { publicRouter } from "./public.routes.js";
import { chatbotAdminRouter, chatbotPublicRouter, chatbotQaRouter, chatbotStepRouter } from "./chatbot.routes.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requirePasswordReady } from "../middlewares/rbac.middleware.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ success: true, message: "OK", data: { status: "healthy" } });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/public", publicRouter);
apiRouter.use("/public/chatbot", chatbotPublicRouter);
apiRouter.get("/robots.txt", publicApi.robots);
apiRouter.get("/sitemap.xml", publicApi.sitemap);

apiRouter.use(authMiddleware);
apiRouter.use(requirePasswordReady);
apiRouter.use("/admins", adminRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/audit-logs", auditRouter);
apiRouter.use("/settings", settingsRouter);
apiRouter.use("/seo", seoRouter);
apiRouter.use("/exchange-rates", exchangeRateRouter);
apiRouter.use("/nrb", nrbRouter);
apiRouter.use("/services", serviceRouter);
apiRouter.use("/service-charges", serviceChargeRouter);
apiRouter.use("/branches", branchRouter);
apiRouter.use("/partners", partnerRouter);
apiRouter.use("/partnership-settings", partnershipSettingsRouter);
apiRouter.use("/partner-applications", partnerApplicationRouter);
apiRouter.use("/news", newsRouter);
apiRouter.use("/faqs", faqRouter);
apiRouter.use("/gallery", galleryRouter);
apiRouter.use("/documents", documentRouter);
apiRouter.use("/pages", pageRouter);
apiRouter.use("/sections", sectionRouter);
apiRouter.use("/navigation", navigationRouter);
apiRouter.use("/social", socialRouter);
apiRouter.use("/team", teamRouter);
apiRouter.use("/about", aboutRouter);
apiRouter.use("/chatbot/qa", chatbotQaRouter);
apiRouter.use("/chatbot/steps", chatbotStepRouter);
apiRouter.use("/chatbot", chatbotAdminRouter);
apiRouter.use("/contact", contactRouter);
apiRouter.use("/media", mediaRouter);
