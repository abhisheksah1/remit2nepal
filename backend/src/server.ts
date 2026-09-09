import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { connectDatabase } from "./database/connection.js";
import { startNrbExchangeRateJob } from "./jobs/nrb-exchange-rate.job.js";

async function bootstrap() {
  await connectDatabase();
  await startNrbExchangeRateJob();
  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info(`API listening on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  logger.fatal({ err: error instanceof Error ? error.message : error }, "Failed to start server");
  process.exit(1);
});
