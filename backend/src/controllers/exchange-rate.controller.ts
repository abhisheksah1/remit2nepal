import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/api-response.js";
import * as rateService from "../services/exchange-rate.service.js";
import { getNrbConfig, syncOfficialRates, updateNrbConfig } from "../services/exchange-rate-sync.service.js";
import { startNrbExchangeRateJob } from "../jobs/nrb-exchange-rate.job.js";
import { NrbSyncLog } from "../models/nrb-sync-log.model.js";
import { parsePagination } from "../utils/pagination.js";

export const listRates = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await rateService.listCurrentRates());
});

export const listCurrencies = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await rateService.listCurrencies());
});

export const saveCurrency = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await rateService.upsertCurrency(req.body), "Currency saved");
});

export const history = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query as Record<string, unknown>);
  sendSuccess(
    res,
    await rateService.rateHistory({
      page,
      limit,
      currencyCode: req.query.currencyCode as string | undefined,
      from: req.query.from as string | undefined,
      to: req.query.to as string | undefined,
      rateKind: req.query.rateKind as "NRB" | "COMPANY" | undefined
    })
  );
});

export const chart = asyncHandler(async (req: Request, res: Response) => {
  const to = req.query.to ? new Date(String(req.query.to)) : new Date();
  const from = req.query.from ? new Date(String(req.query.from)) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  sendSuccess(
    res,
    await rateService.rateChart(String(req.query.currencyCode ?? "USD"), from, to, (req.query.rateKind as "NRB" | "COMPANY") ?? "NRB")
  );
});

export const overrideCompanyRate = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await rateService.updateCompanyRate(req.body, req.user!), "Company rate updated");
});

export const exportHistory = asyncHandler(async (req: Request, res: Response) => {
  const csv = await rateService.exportHistoryCsv({
    currencyCode: req.query.currencyCode as string | undefined,
    from: req.query.from as string | undefined,
    to: req.query.to as string | undefined
  });
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=exchange-rate-history.csv");
  res.send(csv);
});

export const nrbConfig = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await getNrbConfig());
});

export const saveNrbConfig = asyncHandler(async (req: Request, res: Response) => {
  const config = await updateNrbConfig(req.body, req.user);
  await startNrbExchangeRateJob();
  sendSuccess(res, config, "NRB settings updated");
});

export const nrbSync = asyncHandler(async (req: Request, res: Response) => {
  const result = await syncOfficialRates(undefined, req.user?.userId ?? "admin");
  sendSuccess(res, result, "NRB synchronization finished");
});

export const nrbLogs = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await NrbSyncLog.find().sort({ createdAt: -1 }).limit(30).lean());
});
