import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { loginAs, resetCollections, seedAuthFixtures, startTestDb, stopTestDb, testApp, withAuth } from "./harness.js";
import { User } from "../models/user.model.js";
import { CSRF_COOKIE } from "../config/cookies.js";

const app = testApp();

beforeAll(async () => {
  await startTestDb();
});

afterAll(async () => {
  await stopTestDb();
});

beforeEach(async () => {
  await resetCollections();
  await seedAuthFixtures();
});

describe("authentication", () => {
  it("logs in with user ID and password", async () => {
    const { response } = await loginAs(app, "superadmin", "change-this-password");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.userId).toBe("superadmin");
  });

  it("rejects an invalid password", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({ userId: "superadmin", password: "wrong-password" });
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("locks the account after repeated failures", async () => {
    for (let i = 0; i < 8; i += 1) {
      await request(app).post("/api/v1/auth/login").send({ userId: "superadmin", password: "bad" });
    }
    const response = await request(app).post("/api/v1/auth/login").send({ userId: "superadmin", password: "change-this-password" });
    expect([401, 423]).toContain(response.status);
    const user = await User.findOne({ userId: "superadmin" });
    expect((user?.failedLoginAttempts ?? 0) >= 8 || user?.status === "LOCKED").toBe(true);
  });

  it("does not send the user back to change-password after a successful update", async () => {
    await User.updateOne({ userId: "superadmin" }, { mustChangePassword: true });
    const { cookies, csrf } = await loginAs(app, "superadmin", "change-this-password");
    const before = await withAuth(request(app).get("/api/v1/auth/me"), cookies, csrf);
    expect(before.body.data.user.mustChangePassword).toBe(true);

    const changed = await withAuth(request(app).post("/api/v1/auth/change-password"), cookies, csrf).send({
      currentPassword: "change-this-password",
      newPassword: "NewPass!23456"
    });
    expect(changed.status).toBe(200);
    expect(changed.body.data.user.mustChangePassword).toBe(false);

    const dashboard = await withAuth(request(app).get("/api/v1/dashboard"), cookies, csrf);
    expect(dashboard.status).toBe(200);

    const nextCookies = (changed.headers["set-cookie"] as string[] | undefined) ?? cookies;
    const nextCsrf =
      nextCookies.find((cookie) => cookie.startsWith(`${CSRF_COOKIE}=`))?.split(";")[0]?.split("=")[1] ?? csrf;
    const after = await withAuth(request(app).get("/api/v1/auth/me"), nextCookies, nextCsrf);
    expect(after.status).toBe(200);
    expect(after.body.data.user.mustChangePassword).toBe(false);
  });

  it("returns the current user and logs out", async () => {
    const { cookies, csrf } = await loginAs(app, "superadmin", "change-this-password");
    const me = await withAuth(request(app).get("/api/v1/auth/me"), cookies, csrf);
    expect(me.status).toBe(200);
    const logout = await withAuth(request(app).post("/api/v1/auth/logout"), cookies, csrf);
    expect(logout.status).toBe(200);
  });

  it("blocks admin APIs without a session", async () => {
    const response = await request(app).get("/api/v1/dashboard");
    expect(response.status).toBe(401);
  });
});
