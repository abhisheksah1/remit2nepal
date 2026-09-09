import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/api-response.js";
import { AppError } from "../utils/app-error.js";
import { buildBranchTemplate, importBranchesFromExcel } from "../services/branch-import.service.js";

export const downloadTemplate = asyncHandler(async (_req: Request, res: Response) => {
  const buffer = buildBranchTemplate();
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=remit2nepal-agents-template.xlsx");
  res.send(buffer);
});

export const importExcel = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError("Excel file is required", 400);
  const result = await importBranchesFromExcel(req.file, req);
  sendSuccess(res, result, "Agent list imported");
});
