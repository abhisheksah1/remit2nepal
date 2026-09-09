import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { createApp } from "../app.js";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
import { Permission } from "../models/permission.model.js";
import { CompanySetting } from "../models/company-setting.model.js";
import { NrbConfig } from "../models/nrb-config.model.js";
import { Currency } from "../models/currency.model.js";
import { PERMISSIONS, PERMISSION_LABELS } from "../constants/permissions.js";
import { hashSecret } from "../services/token.service.js";
import { CSRF_COOKIE } from "../config/cookies.js";

let mongo: MongoMemoryServer | undefined;

export async function startTestDb(): Promise<void> {
  if (!mongo) {
    mongo = await MongoMemoryServer.create({
      instance: { launchTimeout: 60000 }
    });
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongo.getUri());
  }
}

export async function stopTestDb(): Promise<void> {
  // Keep the in-memory MongoDB process for the whole vitest run.
}

export async function resetCollections(): Promise<void> {
  const collections = await mongoose.connection.db?.collections();
  if (!collections) return;
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
}

export async function seedAuthFixtures(): Promise<void> {
  for (const key of PERMISSIONS) {
    await Permission.create({ key, label: PERMISSION_LABELS[key], module: key });
  }
  await Role.create({ name: "SUPER_ADMIN", description: "full", isSystem: true });
  await Role.create({ name: "ADMIN", description: "limited", isSystem: true });
  await User.create({
    fullName: "Super Administrator",
    userId: "superadmin",
    passwordHash: await hashSecret("change-this-password"),
    role: "SUPER_ADMIN",
    permissions: [...PERMISSIONS],
    status: "ACTIVE",
    mustChangePassword: false
  });
  await User.create({
    fullName: "Limited Admin",
    userId: "branchadmin",
    passwordHash: await hashSecret("AdminPass!2345"),
    role: "ADMIN",
    permissions: ["branches", "dashboard"],
    status: "ACTIVE",
    mustChangePassword: false
  });
  await CompanySetting.create({
    key: "default",
    companyName: "Remit2Nepal",
    publicRateDisplay: "BOTH"
  });
  await NrbConfig.create({
    key: "default",
    enabled: true,
    automaticFetchEnabled: false,
    sourceUrl: "https://www.nrb.org.np/api/forex/v1/rates",
    retryCount: 1,
    timeoutMs: 5000
  });
  await Currency.create({ code: "USD", name: "U.S. Dollar", unit: 1, status: "ACTIVE" });
}

export function testApp() {
  return createApp();
}

export async function loginAs(app: ReturnType<typeof createApp>, userId: string, password: string) {
  const response = await request(app).post("/api/v1/auth/login").send({ userId, password });
  const cookies = response.headers["set-cookie"] as string[] | undefined;
  const csrf = cookies?.find((cookie) => cookie.startsWith(`${CSRF_COOKIE}=`))?.split(";")[0]?.split("=")[1];
  return { response, cookies: cookies ?? [], csrf: csrf ?? "" };
}

export function withAuth(req: request.Test, cookies: string[], csrf: string) {
  return req.set("Cookie", cookies).set("X-CSRF-Token", csrf);
}
