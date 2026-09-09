import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/api-response.js";
import * as authService from "../services/auth.service.js";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  CSRF_COOKIE,
  accessCookieOptions,
  refreshCookieOptions,
  csrfCookieOptions
} from "../config/cookies.js";
import { randomToken } from "../services/token.service.js";

function setAuthCookies(res: Response, accessToken: string, refreshToken?: string) {
  res.cookie(ACCESS_COOKIE, accessToken, accessCookieOptions());
  if (refreshToken) {
    res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions());
  }
  res.cookie(CSRF_COOKIE, randomToken(), csrfCookieOptions());
}

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { userId, password } = req.body as { userId: string; password: string };
  const result = await authService.login(userId, password, req);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  sendSuccess(res, { user: result.user }, "Login successful");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;
  const result = await authService.refreshSession(token ?? "");
  setAuthCookies(res, result.accessToken);
  sendSuccess(res, { user: result.user }, "Session refreshed");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;
  await authService.logout(token, req);
  res.clearCookie(ACCESS_COOKIE, { ...accessCookieOptions(), maxAge: undefined });
  res.clearCookie(REFRESH_COOKIE, { ...refreshCookieOptions(), maxAge: undefined });
  res.clearCookie(CSRF_COOKIE, { ...csrfCookieOptions(), maxAge: undefined });
  sendSuccess(res, null, "Logged out");
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, { user: req.user });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };
  await authService.changePassword(req.user!.id, currentPassword, newPassword, req);
  sendSuccess(res, null, "Password updated");
});
