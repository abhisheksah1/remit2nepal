import type { CookieOptions } from "express";
import { env, isProduction } from "./env.js";

export const ACCESS_COOKIE = "r2n_access";
export const REFRESH_COOKIE = "r2n_refresh";
export const CSRF_COOKIE = "r2n_csrf";

export function accessCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE || isProduction,
    sameSite: env.COOKIE_SAMESITE,
    path: "/",
    maxAge: 15 * 60 * 1000
  };
}

export function refreshCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE || isProduction,
    sameSite: env.COOKIE_SAMESITE,
    path: "/api/v1/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

export function csrfCookieOptions(): CookieOptions {
  return {
    httpOnly: false,
    secure: env.COOKIE_SECURE || isProduction,
    sameSite: env.COOKIE_SAMESITE,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}
