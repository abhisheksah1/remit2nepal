import { Branch } from "../models/branch.model.js";
import { Service } from "../models/service.model.js";
import { News } from "../models/news.model.js";
import { Currency } from "../models/currency.model.js";
import { User } from "../models/user.model.js";
import { ContactMessage } from "../models/contact-message.model.js";
import { ExchangeRate } from "../models/exchange-rate.model.js";
import { NrbSyncLog } from "../models/nrb-sync-log.model.js";
import { AuditLog } from "../models/audit-log.model.js";
import { CompanySetting } from "../models/company-setting.model.js";

export async function dashboardSummary() {
  const [
    branches,
    services,
    news,
    currencies,
    admins,
    messages,
    latestRates,
    lastSync,
    recentAudit,
    settings
  ] = await Promise.all([
    Branch.countDocuments({ status: "ACTIVE" }),
    Service.countDocuments({ status: "ACTIVE" }),
    News.countDocuments({ status: "PUBLISHED" }),
    Currency.countDocuments({ status: "ACTIVE" }),
    User.countDocuments(),
    ContactMessage.countDocuments({ status: "NEW" }),
    ExchangeRate.find({ status: "ACTIVE" }).sort({ updatedAt: -1 }).limit(8).lean(),
    NrbSyncLog.findOne().sort({ createdAt: -1 }).lean(),
    AuditLog.find().sort({ createdAt: -1 }).limit(12).lean(),
    CompanySetting.findOne({ key: "default" }).lean()
  ]);

  return {
    cards: {
      totalBranches: branches,
      activeServices: services,
      publishedNews: news,
      currencies,
      admins,
      unreadMessages: messages,
      websiteStatus: settings?.maintenanceMode ? "MAINTENANCE" : "LIVE",
      lastRateUpdate: latestRates[0]?.fetchedAt ?? latestRates[0]?.updatedAt ?? null
    },
    latestRates,
    sync: lastSync,
    recentActivity: recentAudit
  };
}
