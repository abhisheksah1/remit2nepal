import cron from "node-cron";
import { logger } from "../config/logger.js";
import { NrbConfig } from "../models/nrb-config.model.js";
import { syncOfficialRates } from "../services/exchange-rate-sync.service.js";

let task: cron.ScheduledTask | undefined;

export async function startNrbExchangeRateJob(): Promise<void> {
  const config = await NrbConfig.findOne({ key: "default" });
  const expression = config?.fetchFrequencyCron || "0 * * * *";
  if (task) task.stop();
  task = cron.schedule(expression, async () => {
    const latest = await NrbConfig.findOne({ key: "default" });
    if (!latest?.enabled || !latest.automaticFetchEnabled) {
      logger.info("NRB automatic fetch skipped by configuration");
      return;
    }
    try {
      await syncOfficialRates(undefined, "scheduler");
      logger.info("NRB automatic fetch completed");
    } catch (error) {
      logger.error({ err: error instanceof Error ? error.message : "unknown" }, "NRB automatic fetch failed");
    }
  });
  logger.info({ expression }, "NRB exchange-rate job scheduled");

  if (config?.enabled) {
    void syncOfficialRates(undefined, "startup").then(
      () => logger.info("NRB startup fetch completed"),
      (error: unknown) => logger.error({ err: error instanceof Error ? error.message : "unknown" }, "NRB startup fetch failed")
    );
  }
}
