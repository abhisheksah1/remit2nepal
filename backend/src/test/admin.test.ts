import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { loginAs, resetCollections, seedAuthFixtures, startTestDb, stopTestDb, testApp, withAuth } from "./harness.js";

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

describe("admin management", () => {
  it("lets super admin create another admin", async () => {
    const { cookies, csrf } = await loginAs(app, "superadmin", "change-this-password");
    const response = await withAuth(request(app).post("/api/v1/admins"), cookies, csrf).send({
      fullName: "Operations Admin",
      userId: "opsadmin",
      password: "OpsAdmin!2345",
      role: "ADMIN",
      permissions: ["branches", "dashboard"]
    });
    expect(response.status).toBe(201);
    expect(response.body.data.userId).toBe("opsadmin");
  });

  it("prevents limited admins from creating admins", async () => {
    const { cookies, csrf } = await loginAs(app, "branchadmin", "AdminPass!2345");
    const response = await withAuth(request(app).post("/api/v1/admins"), cookies, csrf).send({
      fullName: "X",
      userId: "xadmin",
      password: "OpsAdmin!2345",
      role: "ADMIN",
      permissions: ["dashboard"]
    });
    expect(response.status).toBe(403);
  });

  it("updates and deactivates an admin", async () => {
    const { cookies, csrf } = await loginAs(app, "superadmin", "change-this-password");
    const created = await withAuth(request(app).post("/api/v1/admins"), cookies, csrf).send({
      fullName: "Temp Admin",
      userId: "tempadmin",
      password: "TempAdmin!2345",
      role: "ADMIN",
      permissions: ["news"]
    });
    const id = created.body.data._id;
    const updated = await withAuth(request(app).patch(`/api/v1/admins/${id}`), cookies, csrf).send({
      fullName: "Temp Admin Updated"
    });
    expect(updated.status).toBe(200);
    const deactivated = await withAuth(request(app).delete(`/api/v1/admins/${id}`), cookies, csrf);
    expect(deactivated.status).toBe(200);
    expect(deactivated.body.data.status).toBe("INACTIVE");
  });
});
