import { Router } from "express";
import { publicApi } from "../controllers/cms.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { contactSchema } from "../validators/common.validator.js";
import { contactRateLimiter } from "../middlewares/rate-limit.middleware.js";

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
publicRouter.get("/gallery", publicApi.gallery);
publicRouter.get("/documents", publicApi.documents);
publicRouter.get("/partners", publicApi.partners);
publicRouter.get("/pages/:slug", publicApi.page);
publicRouter.post("/contact", contactRateLimiter, validate(contactSchema), publicApi.contact);
