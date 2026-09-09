export interface ExchangeRateQuote {
  currencyCode: string;
  currencyName: string;
  unit: number;
  buyRate: number;
  sellRate: number;
  officialRate: number;
  sourceDate: string;
  publishedOn?: string;
  modifiedOn?: string;
}

export interface ExchangeRateProviderResult {
  source: string;
  sourceUrl: string;
  fetchedAt: Date;
  quotes: ExchangeRateQuote[];
}

export interface ExchangeRateProvider {
  fetchLatest(): Promise<ExchangeRateProviderResult>;
}
