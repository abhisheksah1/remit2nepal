import type { EntityId } from "./api";
import type { ExchangeRate, NrbSyncLog } from "./rates";

export interface DashboardCards {
  totalBranches: number;
  activeServices: number;
  publishedNews: number;
  currencies: number;
  admins: number;
  unreadMessages: number;
  websiteStatus: "MAINTENANCE" | "LIVE";
  lastRateUpdate: string | null;
}

export interface AuditLogItem extends EntityId {
  userId: string;
  userName: string;
  action: string;
  module: string;
  entityId: string;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress: string;
  userAgent: string;
}

export interface DashboardPayload {
  cards: DashboardCards;
  latestRates: ExchangeRate[];
  sync: NrbSyncLog | null;
  recentActivity: AuditLogItem[];
}
