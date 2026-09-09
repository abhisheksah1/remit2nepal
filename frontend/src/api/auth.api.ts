import { unwrap, api } from "./client";
import type { AuthPayload } from "@/types/auth";

export const authApi = {
  login: (userId: string, password: string) =>
    unwrap<AuthPayload>(api.post("/auth/login", { userId, password })),
  logout: () => unwrap<null>(api.post("/auth/logout")),
  me: () => unwrap<AuthPayload>(api.get("/auth/me")),
  refresh: () => unwrap<AuthPayload>(api.post("/auth/refresh")),
  changePassword: (currentPassword: string, newPassword: string) =>
    unwrap<null>(api.post("/auth/change-password", { currentPassword, newPassword }))
};
