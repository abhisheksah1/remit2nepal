import { Router, type RequestHandler } from "express";
import type { ZodType } from "zod";
import { validate } from "../middlewares/validate.middleware.js";
import { requirePermission } from "../middlewares/rbac.middleware.js";
import type { PermissionKey } from "../constants/permissions.js";

interface CrudController {
  list: RequestHandler;
  get: RequestHandler;
  create: RequestHandler;
  update: RequestHandler;
  remove: RequestHandler;
}

export function crudRouter(controller: CrudController, schema: ZodType, permission: PermissionKey): Router {
  const router = Router();
  router.use(requirePermission(permission));
  router.get("/", controller.list);
  router.get("/:id", controller.get);
  router.post("/", validate(schema), controller.create);
  router.patch("/:id", validate(schema), controller.update);
  router.delete("/:id", controller.remove);
  return router;
}
