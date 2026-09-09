import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { loginAs, resetCollections, seedAuthFixtures, startTestDb, stopTestDb, testApp, withAuth } from "./harness.js";
import { ExchangeRate } from "../models/exchange-rate.model.js";
import { ExchangeRateHistory } from "../models/exchange-rate-history.model.js";
import { NrbSyncLog } from "../models/nrb-sync-log.model.js";
import { syncOfficialRates } from "../services/exchange-rate-sync.service.js";
import type { ExchangeRateProvider } from "../integrations/exchange-rate-provider.js";
import { normalizeNrbRates, parseNrbResponse } from "../integrations/nrb/nrb.parser.js";

const app = testApp();

const sample = {
  status: { code: 200 },
  data: {
    payload: [
      {
        date: "2026-09-02",
        published_on: "2026-09-02 00:00:40",
        rates: [
          { currency: { iso3: "USD", name: "U.S. Dollar", unit: 1 }, buy: "151.63", sell: "152.23" },
          { currency: { iso3: "EUR", name: "European Euro", unit: 1 }, buy: "175.78", sell: "176.48" }
        ]
      }
    ]
  }
};

beforeAll(async () => {
  await startTestDb();
});
afterAll(async () => {
  await stopTestDb();
});
beforeEach(async () => {
  await resetCollections();
  await seedAuthFixtures();
});

describe("NRB parser", () => {
  it("validates and normalizes the official payload", () => {
    const parsed = parseNrbResponse(sample);
    const quotes = normalizeNrbRates(parsed.item);
    expect(quotes[0]?.currencyCode).toBe("USD");
    expect(quotes[0]?.buyRate).toBe(151.63);
  });
});

describe("exchange rates", () => {
  const provider: ExchangeRateProvider = {
    async fetchLatest() {
      const parsed = parseNrbResponse(sample);
      return {
        source: "NRB",
        sourceUrl: "https://www.nrb.org.np/api/forex/v1/rates",
        fetchedAt: new Date(),
        quotes: normalizeNrbRates(parsed.item)
      };
    }
  };

  it("imports NRB rates and writes history without duplicates", async () => {
    await syncOfficialRates(provider, "test");
    await syncOfficialRates(provider, "test");
    expect(await ExchangeRate.countDocuments()).toBe(2);
    expect(await ExchangeRateHistory.countDocuments()).toBe(2);
  });

  it("keeps stored rates when NRB fails", async () => {
    await syncOfficialRates(provider, "test");
    const failing: ExchangeRateProvider = {
      async fetchLatest() {
        throw new Error("NRB unavailable");
      }
    };
    await expect(syncOfficialRates(failing, "test")).rejects.toThrow();
    expect(await ExchangeRate.countDocuments()).toBe(2);
    expect(await NrbSyncLog.findOne({ status: "FAILED" })).toBeTruthy();
  });

  it("records manual company-rate updates", async () => {
    await syncOfficialRates(provider, "test");
    const { cookies, csrf } = await loginAs(app, "superadmin", "change-this-password");
    const response = await withAuth(request(app).post("/api/v1/exchange-rates/company"), cookies, csrf).send({
      currencyCode: "USD",
      buyRate: 151.1,
      sellRate: 152.9,
      effectiveDate: "2026-09-02",
      reason: "Treasury desk adjustment"
    });
    expect(response.status).toBe(200);
    const history = await ExchangeRateHistory.findOne({ changeType: "MANUAL_UPDATE", currencyCode: "USD" });
    expect(history?.buyRate).toBe(151.1);
  });
});
