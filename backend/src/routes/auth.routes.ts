import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { changePasswordSchema, loginSchema } from "../validators/common.validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { loginRateLimiter } from "../middlewares/rate-limit.middleware.js";

export const authRouter = Router();

authRouter.post("/login", loginRateLimiter, validate(loginSchema), authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", authMiddleware, authController.me);
authRouter.post("/change-password", authMiddleware, validate(changePasswordSchema), authController.changePassword);
