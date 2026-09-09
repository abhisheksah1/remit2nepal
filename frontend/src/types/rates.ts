import type { EntityId, RateDisplayMode, StatusFlag } from "./api";

export interface PublicRate {
  currency: string;
  currencyCode: string;
  unit: number;
  nrbBuyRate?: number;
  nrbSellRate?: number;
  companyBuyRate?: number;
  companySellRate?: number;
  officialRate?: number;
  sourceDate?: string;
  effectiveDate?: string;
  fetchedAt?: string;
}

export interface PublicRatesPayload {
  displayMode: RateDisplayMode;
  lastUpdated: string | null;
  isStale: boolean;
  source: string;
  rates: PublicRate[];
}

export interface ExchangeRate extends EntityId {
  currency: string;
  currencyCode: string;
  unit: number;
  nrbBuyRate?: number;
  nrbSellRate?: number;
  officialRate?: number;
  companyBuyRate?: number;
  companySellRate?: number;
  source: "NRB" | "MANUAL" | "SYSTEM";
  sourceDate?: string;
  effectiveDate?: string;
  fetchedAt?: string;
  lastManualUpdateAt?: string;
  status: StatusFlag;
}

export interface RateHistoryItem extends EntityId {
  currency: string;
  currencyCode: string;
  unit: number;
  previousBuyRate?: number;
  previousSellRate?: number;
  buyRate: number;
  sellRate: number;
  officialRate?: number;
  changeBuy: number;
  changeSell: number;
  source: string;
  sourceDate?: string;
  effectiveDate: string;
  fetchedAt?: string;
  changeType: "NRB_IMPORT" | "MANUAL_UPDATE" | "SYSTEM_SYNC";
  rateKind: "NRB" | "COMPANY";
  changedBy: string;
  reason: string;
}

export interface RateChartPoint {
  date: string;
  buy: number;
  sell: number;
  official?: number;
}

export interface RateChartPayload {
  currencyCode: string;
  series: RateChartPoint[];
  summary: {
    highest: number;
    lowest: number;
    average: number;
    changePercent: string;
  };
}

export interface CurrencyItem extends EntityId {
  code: string;
  name: string;
  symbol: string;
  country: string;
  flag: string;
  decimalPlaces: number;
  unit: number;
  status: StatusFlag;
  displayOrder: number;
}

export interface NrbConfig extends EntityId {
  key: string;
  enabled: boolean;
  automaticFetchEnabled: boolean;
  fetchFrequencyCron: string;
  lastSuccessfulFetch?: string | null;
  lastFailedFetch?: string | null;
  retryCount: number;
  timeoutMs: number;
  sourceUrl: string;
  hasApiKey: boolean;
}

export interface NrbSyncLog extends EntityId {
  status: "SUCCESS" | "PARTIAL" | "FAILED";
  sourceUrl: string;
  sourceDate?: string;
  currenciesUpdated: number;
  recordsCreated: number;
  message: string;
  error: string;
  durationMs: number;
  triggeredBy: string;
}

export interface CompanyRateInput {
  currencyCode: string;
  buyRate: number;
  sellRate: number;
  effectiveDate: string;
  reason: string;
}
