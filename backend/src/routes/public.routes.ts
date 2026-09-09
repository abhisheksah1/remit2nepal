import { Router } from "express";
import { publicApi } from "../controllers/cms.controller.js";
import { partnershipPublic } from "../controllers/partnership.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { contactSchema, trackQuerySchema } from "../validators/common.validator.js";
import { partnerApplicationCreateSchema } from "../validators/partnership.validator.js";
import { contactRateLimiter, trackRateLimiter } from "../middlewares/rate-limit.middleware.js";
import { uploadMany } from "../middlewares/upload.middleware.js";
import { APPLICATION_DOCUMENT_KEYS } from "../constants/partnership.js";

export const publicRouter = Router();

publicRouter.get("/site", publicApi.site);
publicRouter.get("/home", publicApi.home);
publicRouter.get("/exchange-rates", publicApi.rates);
publicRouter.get("/branches/filters", publicApi.branchFilters);
publicRouter.get("/branches", publicApi.branches);
publicRouter.get("/branches/:id", publicApi.branch);
publicRouter.get("/services", publicApi.services);
publicRouter.get("/services/:id", publicApi.service);
publicRouter.get("/news", publicApi.news);
publicRouter.get("/faqs", publicApi.faqs);
publicRouter.get("/service-charges", publicApi.serviceCharges);
publicRouter.get("/gallery", publicApi.gallery);
publicRouter.get("/documents", publicApi.documents);
publicRouter.get("/partners", publicApi.partners);
publicRouter.get("/partnership", partnershipPublic.settings);
publicRouter.get("/partnership/agreements/:slot", partnershipPublic.agreement);
publicRouter.post(
  "/partner-applications",
  contactRateLimiter,
  uploadMany.fields(APPLICATION_DOCUMENT_KEYS.map((name) => ({ name, maxCount: 1 }))),
  validate(partnerApplicationCreateSchema),
  partnershipPublic.apply
);
publicRouter.get("/pages/:slug", publicApi.page);
publicRouter.get("/track", trackRateLimiter, validate(trackQuerySchema, "query"), publicApi.track);
publicRouter.post("/contact", contactRateLimiter, validate(contactSchema), publicApi.contact);
