import { config as loadEnv } from "dotenv";
import { z } from "zod";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const projectRoot = path.resolve(backendRoot, "..");

loadEnv({ path: path.join(projectRoot, ".env") });
loadEnv({ path: path.join(backendRoot, ".env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((value) => value === "true"),
  COOKIE_SAMESITE: z.enum(["lax", "strict", "none"]).default("lax"),
  DEFAULT_SUPER_ADMIN_USER_ID: z.string().min(3).default("superadmin"),
  DEFAULT_SUPER_ADMIN_PASSWORD: z.string().min(8),
  DEFAULT_SUPER_ADMIN_NAME: z.string().default("Super Administrator"),
  NRB_API_URL: z.string().url().default("https://www.nrb.org.np/api/forex/v1/rates"),
  NRB_API_KEY: z.string().optional().default(""),
  NRB_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
  NRB_RETRY_COUNT: z.coerce.number().int().min(0).max(8).default(3),
  CORS_ORIGIN: z.string().min(1).default("http://localhost:5173"),
  UPLOAD_DIR: z.string().default("uploads"),
  UPLOAD_MAX_FILE_SIZE_MB: z.coerce.number().positive().default(10),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
  LOGIN_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(8)
});

const parsed = envSchema.safeParse({
  ...process.env,
  MONGODB_URI: process.env.MONGODB_URI ?? (process.env.NODE_ENV === "test" ? "mongodb://127.0.0.1:27017/remit2nepal-test" : undefined),
  JWT_SECRET: process.env.JWT_SECRET ?? (process.env.NODE_ENV === "test" ? "test-jwt-secret-value" : undefined),
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? (process.env.NODE_ENV === "test" ? "test-refresh-secret-value" : undefined),
  DEFAULT_SUPER_ADMIN_PASSWORD: process.env.DEFAULT_SUPER_ADMIN_PASSWORD ?? (process.env.NODE_ENV === "test" ? "change-this-password" : undefined)
});

if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
  throw new Error(`Invalid environment configuration: ${details}`);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
export const corsOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);
export const uploadRoot = path.isAbsolute(env.UPLOAD_DIR)
  ? env.UPLOAD_DIR
  : path.resolve(projectRoot, env.UPLOAD_DIR);
