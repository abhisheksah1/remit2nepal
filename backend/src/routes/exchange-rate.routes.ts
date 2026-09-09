import { Router } from "express";
import * as rates from "../controllers/exchange-rate.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { companyRateSchema, currencySchema, nrbConfigSchema } from "../validators/common.validator.js";
import { requirePermission } from "../middlewares/rbac.middleware.js";

export const exchangeRateRouter = Router();
exchangeRateRouter.use(requirePermission("exchange_rates"));
exchangeRateRouter.get("/", rates.listRates);
exchangeRateRouter.get("/currencies", rates.listCurrencies);
exchangeRateRouter.post("/currencies", validate(currencySchema), rates.saveCurrency);
exchangeRateRouter.get("/history", rates.history);
exchangeRateRouter.get("/history/export", rates.exportHistory);
exchangeRateRouter.get("/chart", rates.chart);
exchangeRateRouter.post("/company", validate(companyRateSchema), rates.overrideCompanyRate);

export const nrbRouter = Router();
nrbRouter.use(requirePermission("nrb_integration"));
nrbRouter.get("/config", rates.nrbConfig);
nrbRouter.patch("/config", validate(nrbConfigSchema), rates.saveNrbConfig);
nrbRouter.post("/sync", rates.nrbSync);
nrbRouter.get("/logs", rates.nrbLogs);
