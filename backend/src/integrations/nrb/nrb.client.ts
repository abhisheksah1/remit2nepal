import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";
import { AppError } from "../../utils/app-error.js";
import type { NrbApiResponse } from "./nrb.types.js";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildUrl(sourceUrl: string, from: string, to: string): string {
  const url = new URL(sourceUrl);
  url.searchParams.set("page", "1");
  url.searchParams.set("per_page", "1");
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);
  return url.toString();
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchNrbRates(options: {
  sourceUrl: string;
  timeoutMs: number;
  retryCount: number;
  apiKey?: string;
}): Promise<NrbApiResponse> {
  const date = todayIso();
  const url = buildUrl(options.sourceUrl, date, date);
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= options.retryCount; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options.timeoutMs);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      if (options.apiKey) headers.Authorization = `Bearer ${options.apiKey}`;
      const response = await fetch(url, { signal: controller.signal, headers });
      if (!response.ok) {
        throw new AppError(`NRB HTTP ${response.status}`, 502);
      }
      const body = (await response.json()) as NrbApiResponse;
      return body;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("NRB request failed");
      logger.warn({ attempt, err: lastError.message }, "NRB fetch attempt failed");
      if (attempt < options.retryCount) {
        await sleep(500 * 2 ** attempt);
      }
    } finally {
      clearTimeout(timer);
    }
  }

  throw new AppError(lastError?.message ?? "NRB service unavailable", 502);
}

export function defaultNrbSourceUrl(): string {
  return env.NRB_API_URL;
}
