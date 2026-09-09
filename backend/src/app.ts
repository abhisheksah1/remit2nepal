import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import type { RequestHandler } from "express";
import pinoHttp from "pino-http";
import { corsOptions } from "./config/cors.js";
import { logger } from "./config/logger.js";
import { uploadRoot, isProduction, isTest } from "./config/env.js";
import { apiRateLimiter } from "./middlewares/rate-limit.middleware.js";
import { mongoSanitizeMiddleware } from "./middlewares/mongo-sanitize.middleware.js";
import { csrfMiddleware } from "./middlewares/csrf.middleware.js";
import { maintenanceMiddleware } from "./middlewares/maintenance.middleware.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { apiRouter } from "./routes/index.js";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: isProduction ? undefined : false
    })
  );
  app.use(cors(corsOptions));
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(hpp());
  app.use(mongoSanitizeMiddleware);
  const httpLogger = (pinoHttp as unknown as (opts: { logger: typeof logger; autoLogging: boolean }) => RequestHandler)({
    logger,
    autoLogging: !isProduction && !isTest
  });
  app.use(httpLogger);
  app.use("/uploads/private", (_req, res) => {
    res.status(404).end();
  });
  app.use("/uploads", express.static(uploadRoot));
  app.get("/health", (_req, res) => res.json({ success: true, message: "OK", data: { status: "healthy" } }));
  app.use("/api/v1", apiRateLimiter, csrfMiddleware, maintenanceMiddleware, apiRouter);
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);
  return app;
}
