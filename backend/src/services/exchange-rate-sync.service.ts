import crypto from "node:crypto";
import { Currency } from "../models/currency.model.js";
import { ExchangeRate } from "../models/exchange-rate.model.js";
import { ExchangeRateHistory } from "../models/exchange-rate-history.model.js";
import { NrbConfig } from "../models/nrb-config.model.js";
import { NrbSyncLog } from "../models/nrb-sync-log.model.js";
import { writeAudit } from "./audit.service.js";
import { AUDIT_ACTIONS } from "../constants/audit-actions.js";
import { AppError } from "../utils/app-error.js";
import { logger } from "../config/logger.js";
import { createNrbProvider } from "../integrations/nrb/nrb.provider.js";
import type { ExchangeRateProvider, ExchangeRateQuote } from "../integrations/exchange-rate-provider.js";
import { metaForCurrency } from "../constants/currency-meta.js";

function sourceHash(quote: ExchangeRateQuote, kind: string): string {
  return crypto
    .createHash("sha256")
    .update(`${quote.currencyCode}|${quote.sourceDate}|${kind}|${quote.buyRate}|${quote.sellRate}|${quote.unit}`)
    .digest("hex");
}

function isDuplicate(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && (error as { code?: number }).code === 11000);
}

export async function getNrbConfig() {
  const config = await NrbConfig.findOne({ key: "default" });
  if (!config) throw new AppError("NRB configuration is missing", 500);
  const publicConfig = config.toObject();
  return publicConfig;
}

export async function updateNrbConfig(
  input: Partial<{
    enabled: boolean;
    automaticFetchEnabled: boolean;
    fetchFrequencyCron: string;
    retryCount: number;
    timeoutMs: number;
    sourceUrl: string;
  }>,
  actor?: { userId: string; fullName: string }
) {
  const config = await NrbConfig.findOne({ key: "default" });
  if (!config) throw new AppError("NRB configuration is missing", 500);
  const oldValue = config.toObject();
  Object.assign(config, input);
  await config.save();
  if (actor) {
    await writeAudit({
      action: AUDIT_ACTIONS.CHANGE_SETTINGS,
      module: "nrb",
      userId: actor.userId,
      userName: actor.fullName,
      entityId: String(config._id),
      oldValue,
      newValue: config.toObject()
    });
  }
  return config.toObject();
}

export async function syncOfficialRates(
  provider: ExchangeRateProvider | undefined,
  triggeredBy: string
) {
  const started = Date.now();
  const config = await NrbConfig.findOne({ key: "default" });
  if (!config) throw new AppError("NRB configuration is missing", 500);
  if (!config.enabled) {
    return { skipped: true, message: "NRB integration is disabled" };
  }

  const adapter =
    provider ??
    createNrbProvider({
      sourceUrl: config.sourceUrl,
      timeoutMs: config.timeoutMs,
      retryCount: config.retryCount
    });

  let result;
  try {
    result = await adapter.fetchLatest();
  } catch (error) {
    const message = error instanceof Error ? error.message : "NRB sync failed";
    logger.error({ err: message }, "NRB synchronization failed; keeping last successful rates");
    config.lastFailedFetch = new Date();
    await config.save();
    await NrbSyncLog.create({
      status: "FAILED",
      sourceUrl: config.sourceUrl,
      message: "Kept last successful rates",
      error: message,
      durationMs: Date.now() - started,
      triggeredBy
    });
    throw new AppError("NRB service unavailable. Last stored rates were preserved.", 502);
  }

  let recordsCreated = 0;
  let currenciesUpdated = 0;

  for (const quote of result.quotes) {
      const meta = metaForCurrency(quote.currencyCode);
      await Currency.updateOne(
        { code: quote.currencyCode },
        {
          $setOnInsert: {
            code: quote.currencyCode,
            status: "ACTIVE",
            displayOrder: meta.displayOrder,
            country: meta.country,
            flag: meta.flag,
            symbol: meta.symbol
          },
          $set: { name: quote.currencyName, unit: quote.unit }
        },
        { upsert: true }
      );

      const current = await ExchangeRate.findOne({ currencyCode: quote.currencyCode });
      const hash = sourceHash(quote, "NRB_IMPORT");
      const history = await ExchangeRateHistory.findOne({
        currencyCode: quote.currencyCode,
        sourceDate: quote.sourceDate,
        changeType: "NRB_IMPORT",
        rateKind: "NRB",
        sourceHash: hash
      });

      if (!history) {
        try {
          await ExchangeRateHistory.create({
            currency: quote.currencyName,
            currencyCode: quote.currencyCode,
            unit: quote.unit,
            previousBuyRate: current?.nrbBuyRate,
            previousSellRate: current?.nrbSellRate,
            buyRate: quote.buyRate,
            sellRate: quote.sellRate,
            officialRate: quote.officialRate,
            changeBuy: current?.nrbBuyRate != null ? Number((quote.buyRate - current.nrbBuyRate).toFixed(4)) : 0,
            changeSell: current?.nrbSellRate != null ? Number((quote.sellRate - current.nrbSellRate).toFixed(4)) : 0,
            source: "NRB",
            sourceDate: quote.sourceDate,
            effectiveDate: new Date(`${quote.sourceDate}T00:00:00.000Z`),
            fetchedAt: result.fetchedAt,
            changeType: "NRB_IMPORT",
            rateKind: "NRB",
            changedBy: triggeredBy,
            sourceHash: hash
          });
          recordsCreated += 1;
        } catch (error) {
          if (!isDuplicate(error)) throw error;
        }
      }

      await ExchangeRate.updateOne(
        { currencyCode: quote.currencyCode },
        {
          $set: {
            currency: quote.currencyName,
            currencyCode: quote.currencyCode,
            unit: quote.unit,
            nrbBuyRate: quote.buyRate,
            nrbSellRate: quote.sellRate,
            officialRate: quote.officialRate,
            source: "NRB",
            sourceDate: quote.sourceDate,
            effectiveDate: new Date(`${quote.sourceDate}T00:00:00.000Z`),
            fetchedAt: result.fetchedAt,
            status: "ACTIVE"
          },
          $setOnInsert: {
            companyBuyRate: quote.buyRate,
            companySellRate: quote.sellRate
          }
        },
        { upsert: true }
      );
      currenciesUpdated += 1;
    }

    config.lastSuccessfulFetch = new Date();
    await config.save();
    await NrbSyncLog.create({
      status: "SUCCESS",
      sourceUrl: result.sourceUrl,
      sourceDate: result.quotes[0]?.sourceDate,
      currenciesUpdated,
      recordsCreated,
      message: "Official NRB rates synchronized",
      durationMs: Date.now() - started,
      triggeredBy
    });
    await writeAudit({
      action: AUDIT_ACTIONS.IMPORT_NRB_RATE,
      module: "exchange_rates",
      userId: triggeredBy,
      newValue: { currenciesUpdated, recordsCreated, sourceDate: result.quotes[0]?.sourceDate }
    });
    return { skipped: false, currenciesUpdated, recordsCreated, sourceDate: result.quotes[0]?.sourceDate };
}
