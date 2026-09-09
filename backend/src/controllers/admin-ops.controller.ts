import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/api-response.js";
import { dashboardSummary } from "../services/dashboard.service.js";
import { listAuditLogs } from "../services/audit.service.js";
import { parsePagination } from "../utils/pagination.js";
import * as settingsService from "../services/settings.service.js";

export const dashboard = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await dashboardSummary());
});

export const auditLogs = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query as Record<string, unknown>);
  sendSuccess(
    res,
    await listAuditLogs({
      page,
      limit,
      module: req.query.module as string | undefined,
      userId: req.query.userId as string | undefined,
      action: req.query.action as string | undefined
    })
  );
});

export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await settingsService.getSettings());
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await settingsService.updateSettings(req.body, req), "Settings updated");
});

export const getSeo = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await settingsService.getSeo());
});

export const updateSeo = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await settingsService.updateSeo(req.body, req), "SEO updated");
});
