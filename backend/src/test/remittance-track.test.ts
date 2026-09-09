import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { ControlNumber } from "../models/control-number.model.js";
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

describe("public remittance tracking", () => {
  it("returns paid or unpaid when the control number exists", async () => {
    await ControlNumber.create({ controlNumber: "R2N-1001", status: "PAID" });
    await ControlNumber.create({ controlNumber: "R2N-1002", status: "UNPAID" });

    const paid = await request(app).get("/api/v1/public/track").query({ controlNumber: "r2n-1001" });
    expect(paid.status).toBe(200);
    expect(paid.body.data).toEqual({ controlNumber: "R2N-1001", status: "PAID" });

    const unpaid = await request(app).get("/api/v1/public/track").query({ controlNumber: "R2N-1002" });
    expect(unpaid.status).toBe(200);
    expect(unpaid.body.data.status).toBe("UNPAID");
  });

  it("returns invalid when the control number is not in the database", async () => {
    const response = await request(app).get("/api/v1/public/track").query({ controlNumber: "MISSING-99" });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Invalid control number");
  });
});

describe("admin control numbers", () => {
  it("lets an admin add a control number for tracking", async () => {
    const { cookies, csrf } = await loginAs(app, "superadmin", "change-this-password");
    const created = await withAuth(request(app).post("/api/v1/remittances"), cookies, csrf).send({
      controlNumber: "ab-9001",
      status: "UNPAID"
    });
    expect(created.status).toBe(201);
    expect(created.body.data.controlNumber).toBe("AB-9001");

    const tracked = await request(app).get("/api/v1/public/track").query({ controlNumber: "AB-9001" });
    expect(tracked.body.data.status).toBe("UNPAID");
  });
});
