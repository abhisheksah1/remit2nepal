import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export function validate(schema: ZodType, source: "body" | "query" | "params" = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.parse(req[source]);
    req[source] = parsed as never;
    next();
  };
}
