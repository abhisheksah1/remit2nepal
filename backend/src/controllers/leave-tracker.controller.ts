import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/api-response.js";
import * as leaveAuth from "../services/leave-tracker-auth.service.js";
import * as leaveService from "../services/leave-tracker.service.js";
import { AppError } from "../utils/app-error.js";
import { parsePagination } from "../utils/pagination.js";
import {
  CSRF_COOKIE,
  LEAVE_ACCESS_COOKIE,
  LEAVE_REFRESH_COOKIE,
  csrfCookieOptions,
  leaveAccessCookieOptions,
  leaveRefreshCookieOptions
} from "../config/cookies.js";
import { randomToken } from "../services/token.service.js";

function setLeaveCookies(res: Response, accessToken: string, refreshToken: string, rememberMe: boolean) {
  res.cookie(LEAVE_ACCESS_COOKIE, accessToken, leaveAccessCookieOptions());
  res.cookie(LEAVE_REFRESH_COOKIE, refreshToken, leaveRefreshCookieOptions(rememberMe));
  res.cookie(CSRF_COOKIE, randomToken(), csrfCookieOptions());
}

function clearLeaveCookies(res: Response) {
  res.clearCookie(LEAVE_ACCESS_COOKIE, { ...leaveAccessCookieOptions(), maxAge: undefined });
  res.clearCookie(LEAVE_REFRESH_COOKIE, { ...leaveRefreshCookieOptions(true), maxAge: undefined });
}

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { userId, password, rememberMe } = req.body as { userId: string; password: string; rememberMe?: boolean };
  const result = await leaveAuth.login(userId, password, Boolean(rememberMe));
  setLeaveCookies(res, result.accessToken, result.refreshToken, result.rememberMe);
  sendSuccess(res, { user: result.user, rememberMe: result.rememberMe }, "Login successful");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[LEAVE_REFRESH_COOKIE] as string | undefined;
  const result = await leaveAuth.refreshSession(token ?? "");
  setLeaveCookies(res, result.accessToken, result.refreshToken, result.rememberMe);
  sendSuccess(res, { user: result.user, rememberMe: result.rememberMe }, "Session refreshed");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[LEAVE_REFRESH_COOKIE] as string | undefined;
  await leaveAuth.logout(token);
  clearLeaveCookies(res);
  sendSuccess(res, null, "Logged out");
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await leaveAuth.currentUser(req.user!.id));
});

export const dashboard = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await leaveService.dashboard());
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query as Record<string, unknown>);
  sendSuccess(res, await leaveService.listLeaveUsers(page, limit, req.query.search as string | undefined));
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await leaveService.createLeaveUser(req.body, req), "Leave tracker user created", 201);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await leaveService.updateLeaveUser(req.params.id as string, req.body, req), "Leave tracker user updated");
});

export const removeUser = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await leaveService.deactivateLeaveUser(req.params.id as string, req), "Leave tracker user deactivated");
});

export const listEmployees = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query as Record<string, unknown>);
  sendSuccess(res, await leaveService.listEmployees(page, limit, req.query.search as string | undefined));
});

export const uploadEmployeePhoto = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError("Choose a photo to upload", 400);
  sendSuccess(res, await leaveService.storeEmployeePhoto(req.file), "Photo uploaded", 201);
});

export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await leaveService.createEmployee(req.body), "Employee added", 201);
});

export const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await leaveService.updateEmployee(req.params.id as string, req.body), "Employee updated");
});

export const removeEmployee = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await leaveService.removeEmployee(req.params.id as string), "Employee deactivated");
});

export const listTypes = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query as Record<string, unknown>);
  sendSuccess(res, await leaveService.listTypes(page, limit, req.query.search as string | undefined));
});

export const createType = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await leaveService.createType(req.body), "Leave type added", 201);
});

export const updateType = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await leaveService.updateType(req.params.id as string, req.body), "Leave type updated");
});

export const removeType = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await leaveService.removeType(req.params.id as string), "Leave type deactivated");
});

export const attendanceReport = asyncHandler(async (req: Request, res: Response) => {
  const year = req.query.bsYear ? Number(req.query.bsYear) : undefined;
  const month = req.query.bsMonth ? Number(req.query.bsMonth) : undefined;
  sendSuccess(res, await leaveService.attendanceReport(year, month, req.query.search as string | undefined));
});

export const monthRegister = asyncHandler(async (req: Request, res: Response) => {
  const year = req.query.bsYear ? Number(req.query.bsYear) : undefined;
  const month = req.query.bsMonth ? Number(req.query.bsMonth) : undefined;
  sendSuccess(res, await leaveService.monthRegister(year, month, req.query.search as string | undefined));
});

export const listLeaves = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query as Record<string, unknown>);
  sendSuccess(
    res,
    await leaveService.listLeaves(
      page,
      limit,
      req.query.search as string | undefined,
      req.query.status as string | undefined,
      req.query.employee as string | undefined,
      req.query.leaveType as string | undefined,
      req.query.kind as string | undefined
    )
  );
});

export const markAttendance = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await leaveService.markAttendance(req.body), "Days saved", 201);
});

export const createLeave = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await leaveService.createLeave(req.body), "Leave recorded", 201);
});

export const updateLeave = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await leaveService.updateLeave(req.params.id as string, req.body), "Leave updated");
});

export const removeLeave = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await leaveService.removeLeave(req.params.id as string), "Leave cancelled");
});
