import type { Response } from "express";
import type { ApiSuccess } from "../types/express.js";

export function sendSuccess<T>(res: Response, data: T, message = "Operation successful", status = 200): Response {
  const body: ApiSuccess<T> = { success: true, message, data };
  return res.status(status).json(body);
}
