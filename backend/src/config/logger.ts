import pino from "pino";
import { env, isProduction, isTest } from "./env.js";

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      "password",
      "newPassword",
      "currentPassword",
      "DEFAULT_SUPER_ADMIN_PASSWORD",
      "JWT_SECRET",
      "JWT_REFRESH_SECRET",
      "NRB_API_KEY",
      "MONGODB_URI",
      "req.headers.cookie",
      "req.headers.authorization"
    ],
    censor: "[redacted]"
  },
  transport: isProduction || isTest
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard"
        }
      }
});
