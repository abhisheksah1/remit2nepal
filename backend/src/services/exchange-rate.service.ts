import { ExchangeRate } from "../models/exchange-rate.model.js";
import { ExchangeRateHistory } from "../models/exchange-rate-history.model.js";
import { Currency } from "../models/currency.model.js";
import { AppError, NotFoundError } from "../utils/app-error.js";
import { writeAudit } from "./audit.service.js";
import { AUDIT_ACTIONS } from "../constants/audit-actions.js";
import { sha256 } from "./token.service.js";
import { CompanySetting } from "../models/company-setting.model.js";

export async function listCurrencies() {
  return Currency.find().sort({ displayOrder: 1, code: 1 }).lean();
}

export async function upsertCurrency(input: {
  code: string;
  name: string;
  symbol?: string;
  country?: string;
  flag?: string;
  decimalPlaces?: number;
  unit?: number;
  status?: "ACTIVE" | "INACTIVE";
  displayOrder?: number;
}) {
  return Currency.findOneAndUpdate(
    { code: input.code.toUpperCase() },
    { ...input, code: input.code.toUpperCase() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export async function listCurrentRates() {
  return ExchangeRate.find({ status: "ACTIVE" }).sort({ currencyCode: 1 }).lean();
}

export async function publicRates() {
  const [rates, settings] = await Promise.all([
    ExchangeRate.find({ status: "ACTIVE" }).sort({ currencyCode: 1 }).lean(),
    CompanySetting.findOne({ key: "default" }).lean()
  ]);
  const mode = settings?.publicRateDisplay ?? "BOTH";
  const latestFetch = rates.reduce<Date | undefined>((latest, rate) => {
    if (!rate.fetchedAt) return latest;
    if (!latest || rate.fetchedAt > latest) return rate.fetchedAt;
    return latest;
  }, undefined);
  const staleHours = settings?.staleRateHours ?? 36;
  const isStale = !latestFetch || Date.now() - latestFetch.getTime() > staleHours * 60 * 60 * 1000;
  return {
    displayMode: mode,
    lastUpdated: latestFetch ?? null,
    isStale,
    source: "Nepal Rastra Bank",
    rates: rates.map((rate) => ({
      currency: rate.currency,
      currencyCode: rate.currencyCode,
      unit: rate.unit,
      nrbBuyRate: mode === "COMPANY" ? undefined : rate.nrbBuyRate,
      nrbSellRate: mode === "COMPANY" ? undefined : rate.nrbSellRate,
      companyBuyRate: mode === "NRB" ? undefined : rate.companyBuyRate,
      companySellRate: mode === "NRB" ? undefined : rate.companySellRate,
      officialRate: rate.officialRate,
      sourceDate: rate.sourceDate,
      effectiveDate: rate.effectiveDate,
      fetchedAt: rate.fetchedAt
    }))
  };
}

export async function updateCompanyRate(
  input: {
    currencyCode: string;
    buyRate: number;
    sellRate: number;
    effectiveDate: string;
    reason: string;
  },
  actor: { userId: string; fullName: string }
) {
  const rate = await ExchangeRate.findOne({ currencyCode: input.currencyCode.toUpperCase() });
  if (!rate) throw new NotFoundError("Currency rate not found");
  if (input.buyRate <= 0 || input.sellRate <= 0) {
    throw new AppError("Rates must be positive", 400);
  }
  const previous = { buy: rate.companyBuyRate, sell: rate.companySellRate };
  rate.companyBuyRate = input.buyRate;
  rate.companySellRate = input.sellRate;
  rate.lastManualUpdateAt = new Date();
  rate.source = "MANUAL";
  await rate.save();
  const hash = sha256(
    `${rate.currencyCode}|${input.effectiveDate}|MANUAL_UPDATE|COMPANY|${input.buyRate}|${input.sellRate}|${actor.userId}|${Date.now()}`
  );
  await ExchangeRateHistory.create({
    currency: rate.currency,
    currencyCode: rate.currencyCode,
    unit: rate.unit,
    previousBuyRate: previous.buy,
    previousSellRate: previous.sell,
    buyRate: input.buyRate,
    sellRate: input.sellRate,
    officialRate: rate.officialRate,
    changeBuy: previous.buy != null ? Number((input.buyRate - previous.buy).toFixed(4)) : 0,
    changeSell: previous.sell != null ? Number((input.sellRate - previous.sell).toFixed(4)) : 0,
    source: "MANUAL",
    sourceDate: input.effectiveDate,
    effectiveDate: new Date(input.effectiveDate),
    fetchedAt: new Date(),
    changeType: "MANUAL_UPDATE",
    rateKind: "COMPANY",
    changedBy: actor.userId,
    reason: input.reason,
    sourceHash: hash
  });
  await writeAudit({
    action: AUDIT_ACTIONS.UPDATE_EXCHANGE_RATE,
    module: "exchange_rates",
    userId: actor.userId,
    userName: actor.fullName,
    entityId: rate.currencyCode,
    oldValue: previous,
    newValue: { buyRate: input.buyRate, sellRate: input.sellRate, reason: input.reason }
  });
  return rate;
}

export async function rateHistory(params: {
  currencyCode?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  rateKind?: "NRB" | "COMPANY";
}) {
  const filter: Record<string, unknown> = {};
  if (params.currencyCode) filter.currencyCode = params.currencyCode.toUpperCase();
  if (params.rateKind) filter.rateKind = params.rateKind;
  if (params.from || params.to) {
    filter.effectiveDate = {
      ...(params.from ? { $gte: new Date(params.from) } : {}),
      ...(params.to ? { $lte: new Date(params.to) } : {})
    };
  }
  const page = params.page ?? 1;
  const limit = params.limit ?? 50;
  const [items, total] = await Promise.all([
    ExchangeRateHistory.find(filter).sort({ effectiveDate: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ExchangeRateHistory.countDocuments(filter)
  ]);
  return { items, total, page, limit };
}

export async function rateChart(currencyCode: string, from: Date, to: Date, rateKind: "NRB" | "COMPANY" = "NRB") {
  const items = await ExchangeRateHistory.find({
    currencyCode: currencyCode.toUpperCase(),
    rateKind,
    effectiveDate: { $gte: from, $lte: to }
  })
    .sort({ effectiveDate: 1 })
    .lean();
  const series = items.map((item) => ({
    date: item.effectiveDate,
    buy: item.buyRate,
    sell: item.sellRate,
    official: item.officialRate
  }));
  const buys = series.map((item) => item.buy);
  const summary = buys.length
    ? {
        highest: Math.max(...buys),
        lowest: Math.min(...buys),
        average: Number((buys.reduce((sum, value) => sum + value, 0) / buys.length).toFixed(4)),
        changePercent:
          buys.length > 1 ? Number((((buys[buys.length - 1] ?? 0) - (buys[0] ?? 0)) / (buys[0] ?? 1)) * 100).toFixed(2) : "0.00"
      }
    : { highest: 0, lowest: 0, average: 0, changePercent: "0.00" };
  return { currencyCode: currencyCode.toUpperCase(), series, summary };
}

export async function exportHistoryCsv(params: { currencyCode?: string; from?: string; to?: string }) {
  const { items } = await rateHistory({ ...params, page: 1, limit: 5000 });
  const header = "Date,Currency,Kind,Previous Buy,New Buy,Change Buy,Previous Sell,New Sell,Source,Changed By,Change Type";
  const rows = items.map((item) =>
    [
      item.effectiveDate?.toISOString() ?? "",
      item.currencyCode,
      item.rateKind,
      item.previousBuyRate ?? "",
      item.buyRate,
      item.changeBuy,
      item.previousSellRate ?? "",
      item.sellRate,
      item.source,
      item.changedBy,
      item.changeType
    ].join(",")
  );
  return [header, ...rows].join("\n");
}
