import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/api-response.js";
import * as adminService from "../services/admin.service.js";
import { parsePagination } from "../utils/pagination.js";
import { PERMISSIONS, PERMISSION_LABELS } from "../constants/permissions.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query as Record<string, unknown>);
  const data = await adminService.listAdmins(page, limit, req.query.search as string | undefined);
  sendSuccess(res, data);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const admin = await adminService.createAdmin(req.body, req);
  sendSuccess(res, admin, "Administrator created", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const admin = await adminService.updateAdmin(req.params.id as string, req.body, req);
  sendSuccess(res, admin, "Administrator updated");
});

export const deactivate = asyncHandler(async (req: Request, res: Response) => {
  const admin = await adminService.deactivateAdmin(req.params.id as string, req);
  sendSuccess(res, admin, "Administrator deactivated");
});

export const permissions = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(
    res,
    PERMISSIONS.map((key) => ({ key, label: PERMISSION_LABELS[key] }))
  );
});
