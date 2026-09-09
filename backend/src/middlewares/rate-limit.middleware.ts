import rateLimit from "express-rate-limit";
import { env, isTest } from "../config/env.js";

export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  skip: () => isTest,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    errors: []
  }
});

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.LOGIN_RATE_LIMIT_MAX,
  skip: () => isTest,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please wait and try again.",
    errors: []
  }
});

export const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  skip: () => isTest,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many contact submissions. Please try later.",
    errors: []
  }
});

export const chatAskRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  skip: () => isTest,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many chat questions. Please wait a few minutes.",
    errors: []
  }
});
