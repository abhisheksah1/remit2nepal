export interface NrbCurrency {
  iso3?: string;
  ISO3?: string;
  name: string;
  unit: number;
}

export interface NrbRateRow {
  currency: NrbCurrency;
  buy: string | number;
  sell: string | number;
}

export interface NrbPayloadItem {
  date: string;
  published_on?: string;
  modified_on?: string;
  rates: NrbRateRow[];
}

export interface NrbApiResponse {
  status: { code: number };
  errors?: unknown;
  data?: { payload?: NrbPayloadItem[] | null };
}
