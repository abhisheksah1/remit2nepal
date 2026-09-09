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

describe("CMS pages", () => {
  it("creates, updates, and unpublishes a page", async () => {
    const { cookies, csrf } = await loginAs(app, "superadmin", "change-this-password");
    const created = await withAuth(request(app).post("/api/v1/pages"), cookies, csrf).send({
      title: "Compliance",
      slug: "compliance",
      content: "<p>Licensed operations</p>",
      status: "PUBLISHED"
    });
    expect(created.status).toBe(201);
    const id = created.body.data._id;
    const updated = await withAuth(request(app).patch(`/api/v1/pages/${id}`), cookies, csrf).send({
      title: "Compliance",
      slug: "compliance",
      status: "DRAFT"
    });
    expect(updated.status).toBe(200);
    expect(updated.body.data.status).toBe("DRAFT");
  });

  it("blocks CMS writes without website permission", async () => {
    const { cookies, csrf } = await loginAs(app, "branchadmin", "AdminPass!2345");
    const response = await withAuth(request(app).post("/api/v1/pages"), cookies, csrf).send({
      title: "Nope",
      content: "<p>x</p>"
    });
    expect(response.status).toBe(403);
  });
});

describe("branches", () => {
  it("supports CRUD, search, and filter", async () => {
    const { cookies, csrf } = await loginAs(app, "superadmin", "change-this-password");
    const created = await withAuth(request(app).post("/api/v1/branches"), cookies, csrf).send({
      name: "Lalitpur Branch",
      branchCode: "LTP-009",
      province: "Bagmati",
      district: "Lalitpur",
      city: "Lalitpur",
      address: "Pulchowk"
    });
    expect(created.status).toBe(201);
    const listed = await withAuth(request(app).get("/api/v1/branches?search=Lalitpur"), cookies, csrf);
    expect(listed.body.data.total).toBe(1);
    const publicSearch = await request(app).get("/api/v1/public/branches?province=Bagmati&q=Pulchowk");
    expect(publicSearch.status).toBe(200);
    expect(publicSearch.body.data.total).toBe(1);
  });

  it("imports agents from the Excel template format", async () => {
    const XLSX = await import("xlsx");
    const { cookies, csrf } = await loginAs(app, "superadmin", "change-this-password");
    const template = await withAuth(request(app).get("/api/v1/branches/import/template"), cookies, csrf);
    expect(template.status).toBe(200);
    expect(template.headers["content-type"]).toContain("spreadsheetml");

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet([
      ["Agent Name", "District", "Address"],
      ["Butwal Highway Agent", "Rupandehi", "Traffic Chowk, Butwal"],
      ["Butwal Highway Agent", "Rupandehi", "Traffic Chowk, Butwal"]
    ]);
    XLSX.utils.book_append_sheet(workbook, sheet, "Agents");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;

    const imported = await withAuth(request(app).post("/api/v1/branches/import"), cookies, csrf)
      .attach("file", buffer, "agents.xlsx");
    expect(imported.status).toBe(200);
    expect(imported.body.data.created).toBe(1);
    expect(imported.body.data.updated).toBe(1);

    const listed = await request(app).get("/api/v1/public/branches?q=Butwal");
    expect(listed.body.data.total).toBe(1);
    expect(listed.body.data.items[0].province).toBe("Lumbini");
  });
});
