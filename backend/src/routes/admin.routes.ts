import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { adminCreateSchema, adminUpdateSchema } from "../validators/common.validator.js";
import { requireSuperAdmin } from "../middlewares/rbac.middleware.js";

export const adminRouter = Router();

adminRouter.use(requireSuperAdmin);
adminRouter.get("/permissions", adminController.permissions);
adminRouter.get("/", adminController.list);
adminRouter.post("/", validate(adminCreateSchema), adminController.create);
adminRouter.patch("/:id", validate(adminUpdateSchema), adminController.update);
adminRouter.delete("/:id", adminController.deactivate);
