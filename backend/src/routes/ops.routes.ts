import { Router } from "express";
import * as ops from "../controllers/admin-ops.controller.js";
import { requirePermission } from "../middlewares/rbac.middleware.js";

export const dashboardRouter = Router();
dashboardRouter.get("/", requirePermission("dashboard"), ops.dashboard);

export const auditRouter = Router();
auditRouter.get("/", requirePermission("audit_logs"), ops.auditLogs);

export const settingsRouter = Router();
settingsRouter.get("/", requirePermission("settings"), ops.getSettings);
settingsRouter.patch("/", requirePermission("settings"), ops.updateSettings);

export const seoRouter = Router();
seoRouter.get("/", requirePermission("seo"), ops.getSeo);
seoRouter.patch("/", requirePermission("seo"), ops.updateSeo);
