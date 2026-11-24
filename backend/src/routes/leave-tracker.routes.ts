import { Router } from "express";
import * as leave from "../controllers/leave-tracker.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { leaveAuthMiddleware } from "../middlewares/leave-auth.middleware.js";
import { requirePermission } from "../middlewares/rbac.middleware.js";
import { loginRateLimiter } from "../middlewares/rate-limit.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  leaveEmployeeSchema,
  leaveEmployeeUpdateSchema,
  leaveLoginSchema,
  leaveMarkSchema,
  leaveRequestSchema,
  leaveRequestUpdateSchema,
  leaveTypeSchema,
  leaveTypeUpdateSchema,
  leaveUserCreateSchema,
  leaveUserUpdateSchema
} from "../validators/leave-tracker.validator.js";

export const leaveAuthRouter = Router();
leaveAuthRouter.post("/login", loginRateLimiter, validate(leaveLoginSchema), leave.login);
leaveAuthRouter.post("/refresh", leave.refresh);
leaveAuthRouter.post("/logout", leave.logout);
leaveAuthRouter.get("/me", leaveAuthMiddleware, leave.me);

export const leaveTrackerRouter = Router();
leaveTrackerRouter.use(leaveAuthMiddleware);
leaveTrackerRouter.get("/dashboard", leave.dashboard);
leaveTrackerRouter.get("/month-register", leave.monthRegister);
leaveTrackerRouter.get("/report", leave.attendanceReport);
leaveTrackerRouter.get("/employees", leave.listEmployees);
leaveTrackerRouter.post("/employees/photo", upload.single("file"), leave.uploadEmployeePhoto);
leaveTrackerRouter.post("/employees", validate(leaveEmployeeSchema), leave.createEmployee);
leaveTrackerRouter.patch("/employees/:id", validate(leaveEmployeeUpdateSchema), leave.updateEmployee);
leaveTrackerRouter.delete("/employees/:id", leave.removeEmployee);
leaveTrackerRouter.get("/types", leave.listTypes);
leaveTrackerRouter.post("/types", validate(leaveTypeSchema), leave.createType);
leaveTrackerRouter.patch("/types/:id", validate(leaveTypeUpdateSchema), leave.updateType);
leaveTrackerRouter.delete("/types/:id", leave.removeType);
leaveTrackerRouter.get("/leaves", leave.listLeaves);
leaveTrackerRouter.post("/leaves/mark", validate(leaveMarkSchema), leave.markAttendance);
leaveTrackerRouter.post("/leaves", validate(leaveRequestSchema), leave.createLeave);
leaveTrackerRouter.patch("/leaves/:id", validate(leaveRequestUpdateSchema), leave.updateLeave);
leaveTrackerRouter.delete("/leaves/:id", leave.removeLeave);

export const leaveTrackerUsersRouter = Router();
leaveTrackerUsersRouter.use(requirePermission("leave_tracker"));
leaveTrackerUsersRouter.get("/", leave.listUsers);
leaveTrackerUsersRouter.post("/", validate(leaveUserCreateSchema), leave.createUser);
leaveTrackerUsersRouter.patch("/:id", validate(leaveUserUpdateSchema), leave.updateUser);
leaveTrackerUsersRouter.delete("/:id", leave.removeUser);
