import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { loginAs, resetCollections, seedAuthFixtures, startTestDb, stopTestDb, testApp, withAuth } from "./harness.js";
import { ChatbotQa } from "../models/chatbot-qa.model.js";
import { ChatbotAgentStep } from "../models/chatbot-agent-step.model.js";
import { CompanySetting } from "../models/company-setting.model.js";
import { Faq } from "../models/faq.model.js";
import { Branch } from "../models/branch.model.js";
import { ExchangeRate } from "../models/exchange-rate.model.js";
import { TeamMember } from "../models/team-member.model.js";

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

describe("chatbot", () => {
  it("returns public config and answers from admin Q&A and agent steps", async () => {
    await ChatbotQa.create({
      question: "How do I become an agent?",
      answer: "Submit the Become a Agent form with your documents.",
      keywords: "become agent apply",
      category: "Agent",
      status: "ACTIVE",
      displayOrder: 1
    });
    await ChatbotAgentStep.create({
      title: "Choose agent type",
      body: "Pick Cooperative or Private Agent.",
      status: "ACTIVE",
      displayOrder: 1
    });
    await ChatbotAgentStep.create({
      title: "Submit the form",
      body: "Upload the signed agreement and wait for review.",
      status: "ACTIVE",
      displayOrder: 2
    });

    const config = await request(app).get("/api/v1/public/chatbot");
    expect(config.status).toBe(200);
    expect(config.body.data.enabled).toBe(true);
    expect(config.body.data.botName).toBeTruthy();

    const asked = await request(app).post("/api/v1/public/chatbot/ask").send({ message: "How do I become an agent?" });
    expect(asked.status).toBe(200);
    expect(asked.body.data.reply).toMatch(/Become a Agent/i);
    expect(asked.body.data.links?.some((item: { href: string }) => item.href === "/partners")).toBe(true);

    const steps = await request(app).post("/api/v1/public/chatbot/ask").send({ message: "What is step 2?" });
    expect(steps.status).toBe(200);
    expect(steps.body.data.reply).toMatch(/Submit the form/i);
  });

  it("answers How do I install DC from saved Q&A", async () => {
    const asked = await request(app).post("/api/v1/public/chatbot/ask").send({ message: "How DC install" });
    expect(asked.status).toBe(200);
    expect(asked.body.data.reply).toMatch(/certsrv|Internet Explorer|install/i);
  });

  it("answers from live website content", async () => {
    await CompanySetting.updateOne(
      { key: "default" },
      { phone: "01-5261598", email: "info@remit2nepal.com.np", address: "Chakupat, Lalitpur", tagline: "Remitting Happiness..." }
    );
    await Faq.create({
      question: "What identification is required?",
      answer: "Bring original photo ID of the sender and receiver.",
      category: "General",
      status: "ACTIVE"
    });
    await Branch.create({
      name: "Lalitpur Payout Desk",
      branchCode: "LAL-01",
      province: "Bagmati",
      district: "Lalitpur",
      city: "Lalitpur",
      address: "Chakupat",
      phone: "01-5550000",
      status: "ACTIVE"
    });
    await ExchangeRate.create({
      currency: "U.S. Dollar",
      currencyCode: "USD",
      unit: 1,
      nrbBuyRate: 132.1,
      nrbSellRate: 132.7,
      companyBuyRate: 132.2,
      companySellRate: 132.8,
      status: "ACTIVE"
    });

    const phone = await request(app).post("/api/v1/public/chatbot/ask").send({ message: "What is your phone number?" });
    expect(phone.status).toBe(200);
    expect(phone.body.data.reply).toMatch(/01-5261598/);
    expect(phone.body.data.source).toBe("site");

    const faq = await request(app).post("/api/v1/public/chatbot/ask").send({ message: "What identification is required?" });
    expect(faq.status).toBe(200);
    expect(faq.body.data.reply).toMatch(/original photo ID/i);

    const branch = await request(app).post("/api/v1/public/chatbot/ask").send({ message: "Lalitpur branch" });
    expect(branch.status).toBe(200);
    expect(branch.body.data.reply).toMatch(/Lalitpur Payout Desk/);
    expect(branch.body.data.links?.some((item: { href: string }) => item.href.startsWith("/branches"))).toBe(true);

    const agents = await request(app).post("/api/v1/public/chatbot/ask").send({ message: "our agent" });
    expect(agents.status).toBe(200);
    expect(agents.body.data.reply).toMatch(/Lalitpur Payout Desk/);
    expect(agents.body.data.agents?.[0]?.name).toMatch(/Lalitpur Payout Desk/);
    expect(agents.body.data.links?.some((item: { href: string }) => item.href === "/branches" || item.href.startsWith("/branches?"))).toBe(true);

    const rate = await request(app).post("/api/v1/public/chatbot/ask").send({ message: "What is the USD rate?" });
    expect(rate.status).toBe(200);
    expect(rate.body.data.reply).toMatch(/USD/);
    expect(rate.body.data.reply).toMatch(/132/);
    expect(rate.body.data.links?.some((item: { href: string }) => item.href === "/exchange-rate")).toBe(true);

    expect(phone.body.data.links?.some((item: { href: string }) => item.href === "/contact")).toBe(true);
  });

  it("lists directors and Our Team with jump links", async () => {
    await TeamMember.create({
      name: "Rajendra Adhikari",
      title: "Chairman",
      group: "BOARD",
      bio: "Oversees governance.",
      status: "ACTIVE",
      displayOrder: 1
    });
    await TeamMember.create({
      name: "Maya Shrestha",
      title: "Operations Manager",
      group: "TEAM",
      tier: "LEAD",
      bio: "Runs the payout desk.",
      status: "ACTIVE",
      displayOrder: 1
    });

    const directors = await request(app).post("/api/v1/public/chatbot/ask").send({ message: "Who are the directors?" });
    expect(directors.status).toBe(200);
    expect(directors.body.data.reply).toMatch(/Rajendra Adhikari/);
    expect(directors.body.data.agents?.some((item: { name: string }) => item.name === "Rajendra Adhikari")).toBe(true);
    expect(directors.body.data.links?.some((item: { href: string }) => item.href === "/about/board")).toBe(true);

    const team = await request(app).post("/api/v1/public/chatbot/ask").send({ message: "Who is on Our Team?" });
    expect(team.status).toBe(200);
    expect(team.body.data.reply).toMatch(/Maya Shrestha/);
    expect(team.body.data.agents?.some((item: { name: string }) => item.name === "Maya Shrestha")).toBe(true);
    expect(team.body.data.links?.some((item: { href: string }) => item.href === "/about/team")).toBe(true);
  });

  it("lets admin customize copy and blocks limited admins", async () => {
    const { cookies, csrf } = await loginAs(app, "superadmin", "change-this-password");
    const saved = await withAuth(request(app).patch("/api/v1/chatbot/settings"), cookies, csrf).send({
      botName: "Agent Desk",
      welcomeMessage: "Ask about DC install or becoming an agent.",
      launcherLabel: "Ask us"
    });
    expect(saved.status).toBe(200);
    expect(saved.body.data.botName).toBe("Agent Desk");

    const limited = await loginAs(app, "branchadmin", "AdminPass!2345");
    const blocked = await withAuth(request(app).patch("/api/v1/chatbot/settings"), limited.cookies, limited.csrf).send({
      botName: "Nope"
    });
    expect(blocked.status).toBe(403);
  });
});
