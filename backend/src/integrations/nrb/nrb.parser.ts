import { AppError } from "../../utils/app-error.js";
import type { ExchangeRateQuote } from "../exchange-rate-provider.js";
import type { NrbApiResponse, NrbPayloadItem } from "./nrb.types.js";

function toNumber(value: string | number, field: string): number {
  const parsed = typeof value === "number" ? value : Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new AppError(`Invalid NRB ${field} value`, 502);
  }
  return parsed;
}

export function parseNrbResponse(payload: NrbApiResponse): { sourceDate: string; item: NrbPayloadItem } {
  if (payload.status?.code !== 200 || !payload.data?.payload?.length) {
    throw new AppError("NRB returned an empty or invalid exchange-rate payload", 502);
  }
  const item = payload.data.payload[0];
  if (!item?.date || !Array.isArray(item.rates) || item.rates.length === 0) {
    throw new AppError("NRB payload is missing rates", 502);
  }
  return { sourceDate: item.date, item };
}

export function normalizeNrbRates(item: NrbPayloadItem): ExchangeRateQuote[] {
  return item.rates.map((row) => {
    const code = (row.currency.iso3 ?? row.currency.ISO3 ?? "").toUpperCase();
    if (!/^[A-Z]{3}$/.test(code)) {
      throw new AppError(`NRB returned an invalid currency code: ${code || "empty"}`, 502);
    }
    const buyRate = toNumber(row.buy, `${code} buy`);
    const sellRate = toNumber(row.sell, `${code} sell`);
    return {
      currencyCode: code,
      currencyName: row.currency.name,
      unit: Number(row.currency.unit) || 1,
      buyRate,
      sellRate,
      officialRate: Number(((buyRate + sellRate) / 2).toFixed(4)),
      sourceDate: item.date,
      publishedOn: item.published_on,
      modifiedOn: item.modified_on
    };
  });
}
