import type { NextFunction, Request, Response } from "express";
import { CompanySetting } from "../models/company-setting.model.js";

export async function maintenanceMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.path.startsWith("/public")) {
    next();
    return;
  }
  if (req.path === "/public/site") {
    next();
    return;
  }
  const settings = await CompanySetting.findOne({ key: "default" }).lean();
  if (settings?.maintenanceMode) {
    res.status(503).json({
      success: false,
      message: settings.maintenanceMessage || "The website is temporarily unavailable.",
      errors: []
    });
    return;
  }
  next();
}
