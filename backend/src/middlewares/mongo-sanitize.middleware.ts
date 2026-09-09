import type { NextFunction, Request, Response } from "express";
import { assertNoMongoOperators } from "../utils/mongo-sanitize.js";
import { AppError } from "../utils/app-error.js";

export function mongoSanitizeMiddleware(req: Request, _res: Response, next: NextFunction): void {
  try {
    assertNoMongoOperators(req.body, "body");
    assertNoMongoOperators(req.query, "query");
    assertNoMongoOperators(req.params, "params");
    next();
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : "Invalid request", 400));
  }
}
