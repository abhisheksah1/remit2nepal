import { env } from "../../config/env.js";
import type { ExchangeRateProvider, ExchangeRateProviderResult } from "../exchange-rate-provider.js";
import { fetchNrbRates } from "./nrb.client.js";
import { normalizeNrbRates, parseNrbResponse } from "./nrb.parser.js";

export class NrbExchangeRateProvider implements ExchangeRateProvider {
  constructor(
    private readonly sourceUrl: string,
    private readonly timeoutMs: number,
    private readonly retryCount: number,
    private readonly apiKey?: string
  ) {}

  async fetchLatest(): Promise<ExchangeRateProviderResult> {
    const raw = await fetchNrbRates({
      sourceUrl: this.sourceUrl,
      timeoutMs: this.timeoutMs,
      retryCount: this.retryCount,
      apiKey: this.apiKey
    });
    const parsed = parseNrbResponse(raw);
    return {
      source: "NRB",
      sourceUrl: this.sourceUrl,
      fetchedAt: new Date(),
      quotes: normalizeNrbRates(parsed.item)
    };
  }
}

export function createNrbProvider(config?: {
  sourceUrl?: string;
  timeoutMs?: number;
  retryCount?: number;
}): NrbExchangeRateProvider {
  return new NrbExchangeRateProvider(
    config?.sourceUrl ?? env.NRB_API_URL,
    config?.timeoutMs ?? env.NRB_TIMEOUT_MS,
    config?.retryCount ?? env.NRB_RETRY_COUNT,
    env.NRB_API_KEY || undefined
  );
}
