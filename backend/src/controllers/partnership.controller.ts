import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/api-response.js";
import { parsePagination } from "../utils/pagination.js";
import { AppError } from "../utils/app-error.js";
import * as partnership from "../services/partnership.service.js";

export const partnershipPublic = {
  settings: asyncHandler(async (_req: Request, res: Response) => {
    sendSuccess(res, await partnership.getPublicPartnership());
  }),
  agreement: asyncHandler(async (req: Request, res: Response) => {
    await partnership.streamPartnershipAgreement(partnership.parseAgreementSlot(req.params.slot), res);
  }),
  apply: asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await partnership.submitPartnerApplication(req.body as Record<string, string>, req), "Application received", 201);
  })
};

export const partnershipAdmin = {
  settings: asyncHandler(async (_req: Request, res: Response) => {
    sendSuccess(res, await partnership.getPartnershipSettings());
  }),
  updateSettings: asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await partnership.updatePartnershipSettings(req.body, req), "Partnership settings updated");
  }),
  uploadAgreement: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new AppError("File is required", 400);
    sendSuccess(
      res,
      await partnership.uploadPartnershipAgreement(partnership.parseAgreementSlot(req.params.slot), req.file, req),
      "Agreement uploaded",
      201
    );
  }),
  listApplications: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query as Record<string, unknown>);
    sendSuccess(
      res,
      await partnership.listPartnerApplications(page, limit, req.query.search as string | undefined, req.query.status as string | undefined)
    );
  }),
  getApplication: asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await partnership.getPartnerApplication(req.params.id as string));
  }),
  updateApplication: asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await partnership.updatePartnerApplication(req.params.id as string, req.body, req), "Application updated");
  }),
  removeApplication: asyncHandler(async (req: Request, res: Response) => {
    await partnership.deletePartnerApplication(req.params.id as string, req);
    sendSuccess(res, null, "Deleted");
  }),
  downloadDocument: asyncHandler(async (req: Request, res: Response) => {
    await partnership.streamApplicationDocument(req.params.id as string, req.params.docKey as string, res);
  })
};
