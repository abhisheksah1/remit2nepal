import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { loginAs, resetCollections, seedAuthFixtures, startTestDb, stopTestDb, testApp, withAuth } from "./harness.js";
import { LeaveTrackerUser } from "../models/leave-tracker-user.model.js";
import { hashSecret } from "../services/token.service.js";
import { CSRF_COOKIE, LEAVE_REFRESH_COOKIE } from "../config/cookies.js";

describe("leave tracker", () => {
  const app = testApp();

  beforeAll(async () => {
    await startTestDb();
  }, 120000);

  afterAll(async () => {
    await stopTestDb();
  });

  beforeEach(async () => {
    await resetCollections();
    await seedAuthFixtures();
  });

  it("lets an admin create leave-tracker access and that user signs in with remember me", async () => {
    const { cookies, csrf } = await loginAs(app, "superadmin", "change-this-password");
    const created = await withAuth(request(app).post("/api/v1/leave-tracker-users"), cookies, csrf).send({
      fullName: "Leave Clerk",
      userId: "leave.desk",
      password: "LeavePass1",
      email: "leave@example.com"
    });
    expect(created.status).toBe(201);

    const login = await request(app).post("/api/v1/leave-tracker/auth/login").send({
      userId: "leave.desk",
      password: "LeavePass1",
      rememberMe: true
    });
    expect(login.status).toBe(200);
    expect(login.body.data.user.userId).toBe("leave.desk");
    expect(login.body.data.rememberMe).toBe(true);
    const setCookie = login.headers["set-cookie"] as string[];
    expect(setCookie.some((item) => item.startsWith(`${LEAVE_REFRESH_COOKIE}=`) && item.includes("Max-Age="))).toBe(true);

    const session = setCookie;
    const ltCsrf = session.find((cookie) => cookie.startsWith(`${CSRF_COOKIE}=`))?.split(";")[0]?.split("=")[1] ?? "";
    const dashboard = await request(app)
      .get("/api/v1/leave-tracker/dashboard")
      .set("Cookie", session)
      .set("X-CSRF-Token", ltCsrf);
    expect(dashboard.status).toBe(200);
    expect(dashboard.body.data.employees).toBe(0);
  });

  it("records employees, types, and leave", async () => {
    await LeaveTrackerUser.create({
      fullName: "Leave Clerk",
      userId: "leave.desk",
      passwordHash: await hashSecret("LeavePass1"),
      status: "ACTIVE"
    });
    const login = await request(app).post("/api/v1/leave-tracker/auth/login").send({
      userId: "leave.desk",
      password: "LeavePass1",
      rememberMe: false
    });
    expect(login.status).toBe(200);
    const cookies = login.headers["set-cookie"] as string[];
    const csrf = cookies.find((cookie) => cookie.startsWith(`${CSRF_COOKIE}=`))?.split(";")[0]?.split("=")[1] ?? "";
    const authed = (req: request.Test) => req.set("Cookie", cookies).set("X-CSRF-Token", csrf);

    const employee = await authed(request(app).post("/api/v1/leave-tracker/employees")).send({
      employeeId: "EMP-01",
      name: "Sita Rai",
      department: "Operations",
      joinDate: "2025-01-01"
    });
    expect(employee.status).toBe(201);
    expect(employee.body.data.entitlement).toBe(14);
    expect(employee.body.data.leaveLeft).toBe(14);

    const junior = await authed(request(app).post("/api/v1/leave-tracker/employees")).send({
      employeeId: "EMP-02",
      name: "Ram Magar",
      department: "Operations",
      joinDate: "2026-11-01"
    });
    expect(junior.status).toBe(201);
    expect(junior.body.data.entitlement).toBe(0);
    expect(junior.body.data.leaveLeft).toBe(0);

    const types = await authed(request(app).get("/api/v1/leave-tracker/types"));
    expect(types.status).toBe(200);
    const annual = types.body.data.items.find((item: { name: string }) => item.name === "Annual");
    expect(annual).toBeTruthy();

    const leave = await authed(request(app).post("/api/v1/leave-tracker/leaves")).send({
      employee: employee.body.data._id,
      leaveType: annual._id,
      fromDate: "2026-11-24",
      toDate: "2026-11-26",
      reason: "Family visit",
      status: "APPROVED"
    });
    expect(leave.status).toBe(201);
    expect(leave.body.data.days).toBe(-3);

    const half = await authed(request(app).post("/api/v1/leave-tracker/leaves")).send({
      employee: employee.body.data._id,
      leaveType: annual._id,
      kind: "HALF",
      fromDate: "2026-11-27",
      reason: "Morning leave",
      status: "APPROVED"
    });
    expect(half.status).toBe(201);
    expect(half.body.data.days).toBe(-0.5);

    const overtime = await authed(request(app).post("/api/v1/leave-tracker/leaves")).send({
      employee: employee.body.data._id,
      leaveType: annual._id,
      kind: "OVERTIME",
      fromDate: "2026-11-28",
      reason: "Weekend cover",
      status: "APPROVED"
    });
    expect(overtime.status).toBe(201);
    expect(overtime.body.data.days).toBe(1);

    const marked = await authed(request(app).post("/api/v1/leave-tracker/leaves/mark")).send({
      employee: employee.body.data._id,
      days: [
        { date: "2026-11-22", mark: "P" },
        { date: "2026-11-23", mark: "A" },
        { date: "2026-11-29", mark: "O" }
      ]
    });
    expect(marked.status).toBe(201);
    expect(marked.body.data.count).toBe(3);
    const kinds = marked.body.data.items.map((item: { kind: string }) => item.kind);
    expect(kinds).toContain("PRESENT");
    expect(kinds).toContain("FULL");
    expect(kinds).toContain("OVERTIME");

    const after = await authed(request(app).get("/api/v1/leave-tracker/employees")).query({ search: "EMP-01" });
    expect(after.body.data.items[0].leaveLeft).toBe(11.5);

    const register = await authed(request(app).get("/api/v1/leave-tracker/month-register")).query({ bsYear: 2083, bsMonth: 8 });
    expect(register.status).toBe(200);
    expect(register.body.data.employees.length).toBeGreaterThan(0);

    const dash = await authed(request(app).get("/api/v1/leave-tracker/dashboard"));
    expect(dash.body.data.employees).toBe(1);
    expect(dash.body.data.departments[0].department).toBe("Operations");
  });

  it("rejects a CMS admin token on leave tracker routes", async () => {
    const { cookies, csrf } = await loginAs(app, "superadmin", "change-this-password");
    const blocked = await withAuth(request(app).get("/api/v1/leave-tracker/dashboard"), cookies, csrf);
    expect(blocked.status).toBe(401);
  });
});
